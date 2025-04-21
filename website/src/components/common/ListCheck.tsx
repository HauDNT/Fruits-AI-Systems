import {useEffect} from "react";
import {ListCheckInterface} from "@/interfaces";
import {FruitType} from "@/types";
import {Checkbox} from "@/components/ui/checkbox";
import React, {useState} from "react";

const ListCheck = ({title, data, onCheck}: ListCheckInterface<FruitType>) => {
    const [itemSelected, setItemSelect] = useState<number[]>([]);

    useEffect(() => {
        onCheck(itemSelected);
    }, [itemSelected]);

    const handleItemCheck = (itemId: number, checked: boolean) => {
        if (checked) {
            setItemSelect((prev) => {
                if (prev.includes(itemId)) {
                    return prev;
                }

                return [...prev, itemId];
            });
        } else {
            setItemSelect((prev) => prev.filter((id) => id !== itemId));
        }
    }

    return (
        <div>
            {
                title ? (
                    <h3 className={'mb-3'}>{title}</h3>
                ) : null
            }
            {
                data?.length > 0 ? (
                    <ul>
                        {data.map((type, index) => (
                            <li key={index} className={'flex items-center my-3'}>
                                <Checkbox
                                    className={'table-select-item mt-0 mr-3'}
                                    checked={itemSelected.includes(type.id)}
                                    onCheckedChange={(checked => handleItemCheck(type.id, checked as boolean))}
                                />
                                <span>{type.type_name} &nbsp; ({type.type_desc})</span>
                            </li>
                        ))}
                    </ul>
                ) : null
            }
        </div>
    )
}

export default ListCheck