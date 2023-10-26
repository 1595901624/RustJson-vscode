

const fs = require('fs');

class RustBuilderPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        // compiler.hooks.compilation.tap("RustBuilderPlugin", compilation => {
        //     compilation.hooks.afterOptimizeModules.tap("RustBuilderPlugin", compilation => {
        //         this.buildRust(compilation);
        //     });
        // });

        compiler.hooks.entryOption.tap('RustBuilderPlugin', (params) => {
            // params['MyPlugin - data'] = 'important stuff my plugin will use later';
            console.log("entryOption");
            // copy files
            copyFolder('RustJsonLib/pkg', 'pkg/');
            //callback();
        });
    }

    
}

function copyFolder(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }
      
    const files = fs.readdirSync(source);
    
    files.forEach(file => {
      const sourcePath = `${source}/${file}`;
      const destinationPath = `${destination}/${file}`;
        
      if (fs.lstatSync(sourcePath).isDirectory()) {
        copyFolder(sourcePath, destinationPath);
      } else {
        fs.copyFileSync(sourcePath, destinationPath);
      }
    });
  }

module.exports = RustBuilderPlugin;