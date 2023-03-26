import { getCSSString } from '@utilities';
import packageJson from '../package.json';

const MAX_LENGTH = 25;

export class ConsoleInfo {

    constructor() {
        const commonStyles = {
            'border-color' : '#424242',
            'border-style' : 'solid',
            'display'      : 'inline-block',
            'font-size'    : '12px',
            'padding'      : '5px'
        };
        this.lines = [
            `↑↑↑ autoscroll ↑↑↑`,
            '\n',
            `version: ${packageJson.version}`
        ];
        this.styles = [
            getCSSString({
                ...commonStyles,
                'background-color': '#41bdf5',
                'border-width'    : '1px',
                'color'           : 'white'
            }),
            '',
            getCSSString({
                ...commonStyles,
                'background-color': 'white',
                'border-width'    : '0 1px 1px 1px',
                'color'           : '#424242',
            }),
        ];
    }

    private lines: string[];
    private styles: string[];

    public log() {
        const text = this.lines.map((line: string): string => {
            return  `%c${line === '\n' ? line : line.padEnd(MAX_LENGTH)}`;
        }).join('');
        console.info(text, ...this.styles);
    }
}