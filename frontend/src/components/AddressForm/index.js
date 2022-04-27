import React from 'react';
import ToggleSwitch from '../ToggleSwitch';
import './AddressForm.css';

const AddressForm = props => {

    const { form: [form, setForm], handleSubmit } = props;

    const closeForm = () => {
        setForm({...form, open: !form.open})
    }

    const handleChange = e => {
        const key = e.target.name;
        const value = e.target.value;
        setForm({...form, [key]: value})
    }

    return (
        <div className='address'>
            <form className='form' onSubmit={handleSubmit}>
                <h4>Add New Address</h4>
                <svg onClick={closeForm} className='close' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                <label htmlFor='line_1'>Address Line 1*</label>
                <input onChange={handleChange} type='text' name='line_1' id='line_1' required placeholder='Enter Line 1 Of Your Address'/>
                <label htmlFor='line_2'>Address Line 2</label>
                <input onChange={handleChange} type='text' name='line_2' id='line_2' placeholder='Enter Line 2 Of Your Address'/>
                <label htmlFor='city'>City/Town*</label>
                <input onChange={handleChange} type='text' name='city' id='city' required placeholder='Enter Your City/Town'/>
                <label htmlFor='county'>County*</label>
                <input onChange={handleChange} type='text' name='county' id='county' required placeholder='Enter Your County'/>
                <label htmlFor='postcode'>Postcode*</label>
                <input onChange={handleChange} type='text' name='postcode' id='postcode' required placeholder='Enter Your Postcode'/>
                <div className='primary'>
                    <label htmlFor='is_active'>
                        Make this your primary address?
                    </label>
                    <ToggleSwitch onChange={() => setForm({...form, is_primary: !form.is_primary})} checked={form.is_primary}/>
                </div>
                
                <button type='submit'>Add Address</button>
            </form>
        </div>
    )
}

export default AddressForm;