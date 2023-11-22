import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";


interface Props {
    items: string[];
    //optional
    checked?: string[];
    // items: string[] what we want to return
    onChange: (items: string[]) => void;
}

export default function CheckboxButtons ({items,checked,onChange}:Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    
    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
                                      //SPREAD OPERATOR ADD VALUE TO CHECKED ITEMS ARRAY
        if(currentIndex === -1) newChecked = [...checkedItems, value];
        //GIVE US A LIST OF CHECKED ITEMS MINUS THE ONE WERE UNCHECKING
        else newChecked = checkedItems.filter(item => item !== value);
        setCheckedItems(newChecked);
        onChange(newChecked);
    }


    return (
        <FormGroup>
            {items.map(item => (                                                 
                <FormControlLabel            //IF THE INDEX OF THE ITEM IS NOT EQUAL TO -1 WE KNOW THAT IS CHECKED
                control={<Checkbox 
                    checked={checkedItems.indexOf(item) !== -1} 
                    onClick={() => handleChecked(item)} />
                } 
                label={item} key={item} 
                />
            ))}
        </FormGroup>
    )
}