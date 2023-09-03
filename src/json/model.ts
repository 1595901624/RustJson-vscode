import { StringBuilder } from "./string-builder";
import { convertToSnakeCase, hashCode, isDefaultRustKeyword, isDigit } from "./util";

/**
 * rust struct
 */
export class RustStruct {
    /**
     * struct name
     */
    name: string = "";
    /**
     * struct fields
     */
    fields: RustField[] = [];
    /**
     * serde derive
     */
    serde: boolean = true;
    /**
     * public struct
     */
    public: boolean = true;
    /**
     * add option
     */
    option: boolean = true;
    /**
     * debug derive
     */
    debug: boolean = true;
    /**
     * clone derive
     */
    clone: boolean = false;

    /**
     * convert to rust struct string
     */
    toRustStructString(): string {
        // fix struct field name
        this.fields.forEach((field) => {
            field.fixedName = this.processFieldName(field);
        });

        const stringBuilder = new StringBuilder();
        // add derive
        if (this.serde && this.debug && this.clone) {
            stringBuilder.append("#[derive(Serialize, Deserialize, Debug, Clone)]\n");
        } else if (this.serde && this.debug) {
            stringBuilder.append("#[derive(Serialize, Deserialize, Debug)]\n");
        } else if (this.serde && this.clone) {
            stringBuilder.append("#[derive(Serialize, Deserialize, Clone)]\n");
        } else if (this.debug && this.clone) {
            stringBuilder.append("#[derive(Debug, Clone)]\n");
        } else if (this.serde) {
            stringBuilder.append("#[derive(Serialize, Deserialize)]\n");
        } else if (this.debug) {
            stringBuilder.append("#[derive(Debug)]\n");
        } else if (this.clone) {
            stringBuilder.append("#[derive(Clone)]\n");
        }
        // add public
        if (this.public) {
            stringBuilder.append("pub ");
        }
        // add struct name
        stringBuilder.append(`struct ${this.name} {\n`);
        // add fields
        this.fields.forEach((field, index) => {
            stringBuilder.append("\t");
            // add serde
            if (this.serde) {
                stringBuilder.append(`#[serde(rename = "${field.name}")]\n`);
                stringBuilder.append("\t");
            }
            // add public
            if (field.public) {
                stringBuilder.append("pub ");
            }
            // add field name
            stringBuilder.append(`${field.fixedName}: `);
            // add option
            if (this.option) {
                stringBuilder.append("Option<");
            }
            // add field type
            stringBuilder.append(field.type.toString());
            // add object name
            if (field.type === RustType.Vec) {
                stringBuilder.append(`<${field.objectName}>`);
            } else if (field.type === RustType.Obj) {
                stringBuilder.append(`${field.objectName}`);
            }
            // add option
            if (this.option) {
                stringBuilder.append(">");
            }
            stringBuilder.append(",\n");
            // add a blank line
            if (index !== this.fields.length - 1) {
                stringBuilder.append("\n");
            }
        });
        // add end
        stringBuilder.append("}\n");
        return stringBuilder.toString();
    }

    /**
     * process special field name
     */
    processFieldName(field: RustField): string {
        let tempName = convertToSnakeCase(field.fixedName);

        // if name is rust keyword, add "struct name" as prefix
        if (isDefaultRustKeyword(tempName)) {
            tempName = convertToSnakeCase(this.name) + "_" + tempName;
        }

        if (isDigit(tempName)) {
            tempName = convertToSnakeCase(tempName) + "_" + tempName;
        }

        // if name is duplicate, add "struct name" as prefix until not duplicate
        while (
            this.fields.filter(
                (f) => f.fixedName === tempName && f.hashCode() !== field.hashCode()
            ).length > 0
        ) {
            tempName = convertToSnakeCase(tempName) + "_" + tempName;
        }

        return tempName;
    }
}

export class RustField {
    name: string = "";
    type: RustType = RustType.Str;
    public: boolean = true;
    /**
     * if type is Vec/Obj, objectName is the object name of Vec/Obj
     *
     * example:
     * [objectName] is "Person" in "Vec<Person>"
     * [objectName] is "Person" in "Person"
     */
    objectName: string | null = null;

    /**
     * if name is duplicate or rust default keywords, use [fixedName] instead of [name]
     * when init this class, the [fixedName] is same as [name]
     */
    fixedName: string = this.name;

    hashCode(): number {
        let prime = 31;
        let result = 1;
        result = prime * result + hashCode(this.name);
        result = prime * result + hashCode(this.type);
        result = prime * result + hashCode(this.public);
        if (this.objectName) {
            result = prime * result + hashCode(this.objectName);
        }
        return result;
    }

}

export enum RustType {
    Str = "String",
    Integer32 = "i32",
    Integer64 = "i64",
    Integer128 = "i128",
    Float32 = "f32",
    Float64 = "f64",
    UnsignedInteger32 = "u32",
    UnsignedInteger64 = "u64",
    UnsignedInteger128 = "u128",
    IntegerSize = "isize",
    UnsignedIntegerSize = "usize",
    Bool = "bool",
    Vec = "Vec",
    Obj = ""
}

export const I32_MAX = 2147483647;
export const I32_MIN = -2147483648;
export const I64_MAX = 9223372036854775807n;
export const I64_MIN = -9223372036854775808n;
export const I128_MAX = 170141183460469231731687303715884105727n;
export const I128_MIN = -170141183460469231731687303715884105728n;
