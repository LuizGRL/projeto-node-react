export interface IDropDownProps {
    label: string;
    options: IDropdownOption[];
    onChange: (value: string | number) => void;

}

export interface IDropdownOption {
    label: string;
    value:string;
}