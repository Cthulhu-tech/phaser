import { TextButton } from "./button";
import { IButton } from "./type";

export class MainMenuButton extends TextButton {
    constructor({ scene, x, y, text, to }: Omit<IButton, 'style'>) {

        super({ to, scene, x, y, text, style: {
                color: '#0f0',
                fontFamily: 'Georgia',
            },
        });
    }
} 
