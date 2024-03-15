import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs';
import { defaultDiffOptions } from './diff/ISemanticDiffOptions';
import ISerDesOptions from './io/options/ISerDesOptions';
import SemanticDiff from './diff/SemanticDiff';
import { EditScript } from './delta/EditScript';
import DeltaTreeGenerator from './delta/DeltaTreeGenerator';

import ASTDataSerDes from './io/impl/ASTDataSerDes';
import ASTData from './data/ASTData';
const argv = yargs(hideBin(process.argv))
  .command(
    'diff <old> <new>',
    'Calculate the difference between two source files. The supported languages are Dockerfile and Shell.',
    (yargs) => {
      yargs
        .positional('old', {
          description: 'Path to the original document',
          type: 'string'
        })
        .positional('new', {
          description: 'Path to the changed document',
          type: 'string'
        })
        .option('format', {
          description: 'Select the output format',
          alias: 'f',
          type: 'string',
          choices: ['editScript', 'deltaTree'],
          default: 'editScript'
        })
        .check((argv) => {
          if (argv.old == null || !fs.existsSync(argv.old)) {
            throw new Error(argv.old + ' ist not a valid file path');
          }
          if (argv.new == null || !fs.existsSync(argv.new)) {
            throw new Error(argv.new + ' ist not a valid file path');
          }
          return true;
        });
    },
    (argv) => {
      const tNodeDesOptions: ISerDesOptions = {
        ...defaultDiffOptions
      };
      const diffOptions = {
        ...tNodeDesOptions,
        ...defaultDiffOptions
      };

      const tNodeSerDes = new ASTDataSerDes(diffOptions);
      const oldTree = tNodeSerDes.parseFromString(fs.readFileSync(argv.old as string).toString());
      const newTree = tNodeSerDes.parseFromString(fs.readFileSync(argv.new as string).toString());

      switch (argv.format) {
        case 'editScript': {
          const editScript: EditScript<ASTData> = new SemanticDiff<ASTData>(diffOptions).diff(
            oldTree,
            newTree
          );
          for (const edit of editScript) {
            if (edit.type === 'update') {
              console.log(
                'UPDATE',
                edit.oldContent.data.node.toString(),
                edit.newContent.data.node.toString(),
                'at line',
                edit.oldContent.data.node.position.lineStart
              );
            } else if (edit.type === 'insert') {
              console.log(
                'INSERT',
                edit.newContent.data.node.toString(),
                'at line',
                edit.newContent.data.node.position.lineStart
              );
            } else if (edit.type === 'delete') {
              console.log(
                'DELETE',
                edit.oldContent.data.node.toString(),
                'at line',
                edit.oldContent.data.node.position.lineStart
              );
            } else if (edit.type === 'move') {
              console.log(
                'MOVE',
                edit.oldContent.data.node.toString(),
                'from line',
                edit.oldContent.data.node.position.lineStart,
                'to line',
                edit.newContent.data.node.position.lineStart
              );
            }
          }
          // console.log(editScript);
          break;
        }
        case 'deltaTree': {
          const deltaTreeGenerator = new DeltaTreeGenerator<ASTData>();
          const deltaTree = deltaTreeGenerator.generate(oldTree, newTree, diffOptions);
          console.log(tNodeSerDes.buildString(deltaTree));
          break;
        }
      }
    }
  )
  .help()
  .version()
  .demandCommand()
  .strictCommands().argv;
