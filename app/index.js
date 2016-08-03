/**
 * Created by Edo on 03/08/2016.
 */
var generators = require("yeoman-generator");

module.exports = generators.Base.extend({

    appName: "",

    constructor : function () {
        generators.Base.apply(this, arguments);
    },

    prompting : {
        appName : function () {
            return this.prompt([{
                type    : 'input',
                name    : 'name',
                message : 'Your project name',
                default : this.appname // Default to current folder name
            }]).then(function (answers) {
                this.appName = answers.name;
            }.bind(this));
        }
    },

    writing:{
        copyFiles: function () {
            this.fs.copyTpl(
                this.templatePath("**/*"),
                this.destinationPath("Development"),
                { app: {
                    name: this.appName
                }}
            );
        }
    },

    install:{
        installDep: function () {
            process.chdir("Development/");
            this.installDependencies({npm: true, bower:false, callback:function()
            {
                process.chdir("../");
            }});
        }
    }
});