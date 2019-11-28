import { Directory, FileSystemState } from './types';

const directoryRoot: Directory = {
  type: 'DIRECTORY',
  children: [
    [
      'top-secret',
      {
        type: 'DIRECTORY',
        children: [
          [
            'real-secret',
            {
              type: 'DIRECTORY',
              children: [
                [
                  'random',
                  {
                    type: 'DIRECTORY',
                    children: [
                      [
                        'actual-fact.txt',
                        {
                          type: 'TEXT_FILE',
                          text: 'Just to show you this system can support nested directories.'
                        }
                      ]
                    ]
                  }
                ],
                ['real-fact.txt', { type: 'TEXT_FILE', text: 'Really, nothing here.' }]
              ]
            }
          ],
          ['fact.txt', { type: 'TEXT_FILE', text: 'Nothing here.' }]
        ]
      }
    ],
    ['blog.txt', { type: 'TEXT_FILE', text: 'https://blog.developersam.com/' }],
    ['github.txt', { type: 'TEXT_FILE', text: 'https://github.com/SamChou19815' }],
    ['README.md', { type: 'TEXT_FILE', text: '# Developer Sam' }],
    ['www.txt', { type: 'TEXT_FILE', text: 'https://developersam.com/' }]
  ]
};

/**
 * The initial state of the file system.
 */
const initialState: FileSystemState = { root: directoryRoot, stack: [['', directoryRoot]] };
export default initialState;
