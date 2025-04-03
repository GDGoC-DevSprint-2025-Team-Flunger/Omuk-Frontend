'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaCarrot,
    FaBalanceScale,
    FaWineBottle,
    FaIceCream,
    FaPlus,
    FaTimes,
    FaEdit,
    FaSave,
} from 'react-icons/fa';
import { TbMeat } from "react-icons/tb";

type IconType = 'carrot' | 'meat' | 'bottle' | 'icecream';

interface Ingredient {
    name: string;
    amount: string;
    icon: IconType;
}

interface Props {
    title: string;
    storageKey: string;
}

const icons: Record<IconType, React.ReactElement> = {
    carrot: <FaCarrot size={50} />,
    meat: <TbMeat size={50} />,
    bottle: <FaWineBottle size={50} />,
    icecream: <FaIceCream size={50} />,
};

const iconOptions: IconType[] = ['carrot', 'meat', 'bottle', 'icecream'];

const IngredientCard: React.FC<Props> = ({ title, storageKey }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [icon, setIcon] = useState<IconType>('carrot');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedIngredients, setEditedIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setIngredients(JSON.parse(saved));
    }, [storageKey]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !amount.trim()) return;

        const newItem = { name, amount, icon };
        const updated = [...ingredients, newItem];
        setIngredients(updated);
        setName('');
        setAmount('');
        setIcon('carrot');
        setIsAdding(false);

        localStorage.setItem(storageKey, JSON.stringify(updated));
        try {
            await axios.post('http://3.38.114.206:8080/ingredient', {
                type: storageKey,
                ...newItem,
            });
        } catch (error) {
            console.error('API 전송 실패:', error);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setIngredients(editedIngredients);
            localStorage.setItem(storageKey, JSON.stringify(editedIngredients));
        } else {
            setEditedIngredients([...ingredients]);
        }
        setIsEditing(!isEditing);
    };

    const handleEditChange = (index: number, field: keyof Ingredient, value: string) => {
        const updated = [...editedIngredients];
        updated[index][field] = value as any;
        setEditedIngredients(updated);
    };

    const toggleIcon = () => {
        const currentIndex = iconOptions.indexOf(icon);
        const nextIndex = (currentIndex + 1) % iconOptions.length;
        setIcon(iconOptions[nextIndex]);
    };

    const toggleEditIcon = (index: number) => {
        const current = editedIngredients[index].icon;
        const currentIndex = iconOptions.indexOf(current);
        const nextIndex = (currentIndex + 1) % iconOptions.length;
        handleEditChange(index, 'icon', iconOptions[nextIndex]);
    };

    const handleDelete = (index: number) => {
        const updated = editedIngredients.filter((_, i) => i !== index);
        setEditedIngredients(updated);
    };

    return (
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">{title}</h5>
                    <button className="btn btn-sm btn-outline-primary" onClick={handleEditToggle}>
                        {isEditing ? (
                            <>
                                <FaSave className="me-1" /> 저장
                            </>
                        ) : (
                            <>
                                <FaEdit className="me-1" /> 수정
                            </>
                        )}
                    </button>
                </div>

                <div className="row">
                    {(isEditing ? editedIngredients : ingredients).map((item, i) => (
                        <div key={i} className="col-4 mb-3 position-relative">
                            <div
                                className="border rounded p-3 bg-white d-flex flex-column justify-content-between align-items-center"
                                style={{ aspectRatio: '1 / 1', position: 'relative' }}
                            >
                                {isEditing && (
                                    <button
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{ top: '8px', right: '8px' }}
                                        onClick={() => handleDelete(i)}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                                <div className="mb-2 text-center">
                                    {isEditing ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => toggleEditIcon(i)}
                                        >
                                            {icons[item.icon]}
                                        </button>
                                    ) : (
                                        <div>{icons[item.icon]}</div>
                                    )}
                                </div>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.name}
                                            onChange={(e) => handleEditChange(i, 'name', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.amount}
                                            onChange={(e) => handleEditChange(i, 'amount', e.target.value)}
                                        />
                                    </>
                                ) : (
                                    <div className="mt-auto text-center mt-2">
                                        <h6 className="fw-bold">{item.name}</h6>
                                        <p className="text-muted">{item.amount}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="col-4 mb-3">
                        <div
                            className="border rounded p-3 bg-light d-flex justify-content-center align-items-center"
                            style={{ aspectRatio: '1 / 1' }}
                        >
                            {!isAdding ? (
                                <div
                                    className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIsAdding(true)}
                                >
                                    <FaPlus size={28} className="text-primary" />
                                    <div className="mt-2 fw-semibold">재료 추가</div>
                                </div>
                            ) : (
                                <form onSubmit={handleAdd} className="w-100" style={{ aspectRatio: '1 / 1' }}>
                                    <div className="mb-3 d-flex justify-content-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={toggleIcon}
                                        >
                                            {icons[icon]}
                                        </button>
                                    </div>
                                    <div className="mb-1">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="재료 이름"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-1">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="남은 양"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary w-50">
                                            추가
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary w-50"
                                            onClick={() => setIsAdding(false)}
                                        >
                                            취소
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngredientCard;
