import {Drawing} from '../Drawing';
import {NoteBase} from './NoteBase';



export class NoteDrawing extends NoteBase {
    static get className(): string {
        return 'note';
    }

}

Drawing.register(NoteDrawing);


