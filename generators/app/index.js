'use strict';
const yeoman = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
let plBase = ('./');

/**
 * Turn comma separated string list into arry
 * @param {String} answer
 * @returns {Array.<String>}
 */
function parseMultiStringAnswer(answer) {
  return answer
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '');
}

/**
 * Turn string answer into object with options for different formats
 * @param {String} answer
 * @returns {{raw: string, dash: string, under: string}}
 */
function handleSpaces(answer) {
  const x = answer.trim().toLowerCase();
  return {
    raw: answer,
    dash: x.replace(/ /g, '-'),
    under: x.replace(/ /g, '_')
  };
}

module.exports = yeoman.Base.extend({
  prompting: function () {
    console.log('Hi! This will help you build a component folder with assets.');
    // Console.log('Templates for this are in: ' + path.relative(process.cwd(), __dirname));
    console.log('');

    // Ran with `--base path/to/folder/`
    if (this.options.base) {
      plBase = path.resolve(process.cwd(), this.options.base);
    }

    // @todo Add `templates` option
    // if (this.options.templates) {
    //   const dir = path.resolve(process.cwd(), this.options.templates);
    //   if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    //
    //   } else {
    //     console.log('Path passed to "templates" must be a directory that exists.');
    //   }
    // }

    const prompts = [
      {
        type: 'list',
        name: 'patternType',
        message: 'Where would you like this new component?',
        choices: fs.readdirSync(plBase, 'utf8')
      },
      // {
      //   type: 'list',
      //   name: 'patternSubType',
      //   message: 'Where in here?',
      //   choices: function (answers) {
      //     var folder = path.join(plBase, answers.patternType);
      //     var subfolders = fs.readdirSync(folder, 'utf8');
      //     return ['./'].concat(subfolders);
      //   }
      // },
      {
        type: 'checkbox',
        name: 'files',
        message: 'What files would you like in there?',
        choices: [
          'twig',
          'scss',
          'js',
          'md'
        ],
        default: [
          'twig',
          'scss',
          'md'
        ]
      },
      {
        name: 'name',
        message: 'What is it\'s name? This is the Block. Title Case and spaces encouraged.'
      },
      {
        name: 'elements',
        message: 'What Elements does it have? (i.e. title, subtitle, body, etc) Enter comma separated list. Title Case and spaces encouraged.'
      },
      {
        name: 'modifiers',
        message: 'What Modifiers does it have? (i.e. big, dark) Enter comma separated list. Title Case and spaces encouraged.'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      props.name = handleSpaces(props.name);
      props.elements = parseMultiStringAnswer(props.elements).map(handleSpaces);
      props.modifiers = parseMultiStringAnswer(props.modifiers).map(handleSpaces);
      props.namespace = props.patternType.replace(/[0-9]*-/g, ''); // `01-atoms` => `atoms`
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    // Console.log(this.props);
    const destPath = path.join(
      plBase,
      this.props.patternType,
      // This.props.patternSubType,
      this.props.name.dash
    );

    if (this.props.files.some(file => file === 'scss')) {
      this.fs.copyTpl(
        this.templatePath('_pattern.scss.ejs'),
        this.destinationPath(path.join(destPath, '_' + this.props.name.dash + '.scss')),
        this.props
      );
    }

    if (this.props.files.some(file => file === 'twig')) {
      this.fs.copyTpl(
        this.templatePath('_pattern.twig.ejs'),
        this.destinationPath(path.join(destPath, `_${this.props.name.dash}.twig`)),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('pattern-demo.twig.ejs'),
        this.destinationPath(path.join(destPath, `01-${this.props.name.dash}-default.twig`)),
        Object.assign({}, this.props, {modifier: false})
      );
      this.fs.copyTpl(
        this.templatePath('pattern.md.ejs'),
        this.destinationPath(path.join(destPath, `01-${this.props.name.dash}-default.md`)),
        {
          title: `${this.props.name.raw} (Default)`
        }
      );

      this.props.modifiers.forEach((modifier, i) => {
        let number = (i + 1) * 5;
        if (number === 5) {
          number = '05';
        }
        const name = `${number}-${this.props.name.dash}--${modifier.dash}`;
        this.fs.copyTpl(
          this.templatePath('pattern-demo.twig.ejs'),
          this.destinationPath(path.join(destPath, `${name}.twig`)),
          Object.assign({}, this.props, {modifier})
        );
        this.fs.copyTpl(
          this.templatePath('pattern.md.ejs'),
          this.destinationPath(path.join(destPath, `${name}.md`)),
          {
            title: `${this.props.name.raw} (${modifier.raw})`
          }
        );
      });
    }

    if (this.props.files.some(file => file === 'js')) {
      this.fs.copyTpl(
        this.templatePath('pattern.js.ejs'),
        this.destinationPath(path.join(destPath, this.props.name.dash + '.js')),
        this.props
      );
    }

    if (this.props.files.some(file => file === 'md')) {
      this.fs.copyTpl(
        this.templatePath('main.md.ejs'),
        this.destinationPath(path.join(destPath, '..', this.props.name.dash + '.md')),
        this.props
      );
    }
  }

});
