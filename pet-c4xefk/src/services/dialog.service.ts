export interface DialogProps {
    title: string;
    content: string;
}
export class DialogService {

    private dialog!: HTMLDialogElement;
    private dialogTitle!: HTMLTitleElement;
    private dialogContent!: HTMLDivElement;

    constructor(props?: DialogProps) {
        this.dialog = document.getElementById('dialog') as HTMLDialogElement;
        this.dialogTitle = document.getElementById('dialogTitle') as HTMLTitleElement;
        this.dialogContent = document.getElementById('dialogContent') as HTMLDivElement;

        if(props){
            this.setTitle(props.title);
            this.setContent(props.content);
            this.show();
        }
    }

    setTitle(title: string): void {
        this.dialogTitle.textContent = title;
    }

    setContent(content: string): void {
        this.dialogContent.innerHTML = content;
    }

    show(): void {
        this.dialog.showModal();
    }
    hide(): void {
        this.dialogContent.innerHTML = "";
        this.dialogTitle.textContent = "";
        this.dialog.close();
    }
}