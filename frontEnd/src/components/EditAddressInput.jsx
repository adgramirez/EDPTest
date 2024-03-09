import { useState} from 'react'
import EditInputBox from "./UI/EditInputBox"


function EditAddressInput({ onAddressChange, employee }) {
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        onAddressChange(prevAddress => ({
            ...prevAddress,
            [field]: value
        }));
    };

    return (
        <div className="flex left-align">
            <p>2. Address Details</p>
            <div>
                <p>(House No.)</p>
                <EditInputBox label="Ex. B10, L5" defaultValue={employee.houseNumber} onChange={(e) => handleInputChange(e, 'HouseNumber')}/>
            </div>
            <div>
                <p>(Street)</p>
                <EditInputBox label="Ex. Aguila St." defaultValue={employee.street} onChange={(e) => handleInputChange(e, 'Street')}/>
            </div>
            <div>
                <p>(Barangay)</p>
                <EditInputBox label="Ex. Tibungco" defaultValue={employee.barangay} onChange={(e) => handleInputChange(e, 'Barangay')}/>
            </div>
            <div>
                <p>(City)</p>
                <EditInputBox label="Ex. Davao City" defaultValue={employee.city} onChange={(e) => handleInputChange(e, 'City')}/>
            </div>
            <div>
                <p>(Province)</p>
                <EditInputBox label="Ex. Davao del Sur" defaultValue={employee.province} onChange={(e) => handleInputChange(e, 'Province')}/>
            </div>
            <div>
                <p>(Country)</p>
                <EditInputBox label="Ex. Philippines" defaultValue={employee.country} onChange={(e) => handleInputChange(e, 'Country')}/>
            </div>
            <div>
                <p>(Zip Code)</p>
                <EditInputBox label="Ex. 8000" defaultValue={employee.zipcode} onChange={(e) => handleInputChange(e, 'ZIPcode')}/>
            </div>
        </div>
    )
}

export default EditAddressInput