import React, { useState } from 'react'
import PropTypes from 'prop-types';
import './index.scss';
import { SVGIcon } from '../SVGIcon';
export const TodoModal = ({
    open = false,
    onClose = () => {},
    onSubmit = () => {}
}) => {
    const [formState, setFormState] = useState('');
    const createItem = (e) => {
        e.preventDefault();
        onSubmit(formState);
        onClose();
    }
    
    return (
        <div className={`todo__modal ${open ? 'active-modal' : ''}`}>
            <div className="todo__modal--box">
                <div className="box-title">
                    <h4>Create Todo</h4>
                    <span onClick={onClose}>
                        <SVGIcon name='clear' />
                    </span>
                </div>
                <div className="box-body">
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" placeholder="Title" autoComplete="off" onChange={e => setFormState(e.target.value)} value={formState} />
                    </div>
                </div>
                <div className="box-footer">
                    <button className="btn todo__modal-btnSubmit" onClick={createItem}>Create</button>
                </div>
            </div>
        </div>
    )
}

TodoModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
}
