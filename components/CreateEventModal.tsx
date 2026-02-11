import React, { useState } from 'react';

import Modal from './Modal';

import Button from './Button';

import { Calendar, MapPin, Music, DollarSign, Users, Image } from 'lucide-react';

import { Venue } from '../types';


interface CreateEventModalProps {

    isOpen: boolean;

    onClose: () => void;

    onCreate: (eventData: any) => void;

}


const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreate }) => {

    const [formData, setFormData] = useState({

        title: '',

        subtitle: '',

        genre: '',

        date: '',

        timeStart: '22:00',

        timeDoors: '21:00',

        venue: 'Grande Salle',

        description: '',

        capacity: 750,

        pricePresale: 25,

        priceDoor: 30,

        status: 'DRAFT',

        imageUrl: ''

    });


    const [loading, setLoading] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: name === 'capacity' || name === 'pricePresale' || name === 'priceDoor'

                ? Number(value)

                : value

        }));

    };


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!formData.title || !formData.date) {

            return;

        }

        setLoading(true);

        try {

            await onCreate(formData);

            setFormData({

                title: '',

                subtitle: '',

                genre: '',

                date: '',

                timeStart: '22:00',

                timeDoors: '21:00',

                venue: 'Grande Salle',

                description: '',

                capacity: 750,

                pricePresale: 25,

                priceDoor: 30,

                status: 'DRAFT',

                imageUrl: ''

            });

        } finally {

            setLoading(false);

        }

    };


    const sampleImages = [

        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',

        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',

        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',

        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',

        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',

        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800'

    ];


    return (

        <Modal isOpen={isOpen} onClose={onClose} title="CRÉER UN ÉVÉNEMENT">

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">


                {/* Title & Subtitle */}

                <div className="space-y-3">

                    <div>

                        <label className="block text-[#E91E63] text-xs font-mono font-bold mb-1 uppercase">

                            <Music size={12} className="inline mr-1" /> Titre de l'événement *

                        </label>

                        <input

                            type="text"

                            name="title"

                            value={formData.title}

                            onChange={handleChange}

                            required

                            placeholder="Ex: SPFDJ Live"

                            className="w-full bg-black border-2 border-white text-white px-3 py-2 font-mono focus:outline-none focus:border-[#E91E63]"

                        />

                    </div>


                    <div className="grid grid-cols-2 gap-3">

                        <div>

                            <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">Sous-titre</label>

                            <input

                                type="text"

                                name="subtitle"

                                value={formData.subtitle}

                                onChange={handleChange}

                                placeholder="Ex: Techno Night"

                                className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-white"

                            />

                        </div>

                        <div>

                            <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">Genre</label>

                            <input

                                type="text"

                                name="genre"

                                value={formData.genre}

                                onChange={handleChange}

                                placeholder="Ex: Techno"

                                className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-white"

                            />

                        </div>

                    </div>

                </div>


                {/* Date & Time */}

                <div className="grid grid-cols-3 gap-3">

                    <div>

                        <label className="block text-[#E91E63] text-xs font-mono font-bold mb-1 uppercase">

                            <Calendar size={12} className="inline mr-1" /> Date *

                        </label>

                        <input

                            type="date"

                            name="date"

                            value={formData.date}

                            onChange={handleChange}

                            required

                            className="w-full bg-black border-2 border-white text-white px-3 py-2 font-mono focus:outline-none focus:border-[#E91E63]"

                        />

                    </div>

                    <div>

                        <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">Portes</label>

                        <input

                            type="time"

                            name="timeDoors"

                            value={formData.timeDoors}

                            onChange={handleChange}

                            className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono focus:outline-none focus:border-white"

                        />

                    </div>

                    <div>

                        <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">Début</label>

                        <input

                            type="time"

                            name="timeStart"

                            value={formData.timeStart}

                            onChange={handleChange}

                            className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono focus:outline-none focus:border-white"

                        />

                    </div>

                </div>


                {/* Venue & Capacity */}

                <div className="grid grid-cols-2 gap-3">

                    <div>

                        <label className="block text-[#E91E63] text-xs font-mono font-bold mb-1 uppercase">

                            <MapPin size={12} className="inline mr-1" /> Salle / Lieu

                        </label>

                        <select

                            name="venue"

                            value={formData.venue}

                            onChange={handleChange}

                            className="w-full bg-black border-2 border-white text-white px-3 py-2 font-mono focus:outline-none focus:border-[#E91E63]"

                        >

                            <option value="Grande Salle">Grande Salle (750)</option>

                            <option value="QKC">QKC (100)</option>

                            <option value="Interlope">Interlope (80)</option>

                        </select>

                    </div>

                    <div>

                        <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">

                            <Users size={12} className="inline mr-1" /> Capacité

                        </label>

                        <input

                            type="number"

                            name="capacity"

                            value={formData.capacity}

                            onChange={handleChange}

                            min="1"

                            max="1000"

                            className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono focus:outline-none focus:border-white"

                        />

                    </div>

                </div>


                {/* Pricing */}

                <div className="grid grid-cols-2 gap-3">

                    <div>

                        <label className="block text-[#FFFF00] text-xs font-mono font-bold mb-1 uppercase">

                            <DollarSign size={12} className="inline mr-1" /> Prévente (CHF)

                        </label>

                        <input

                            type="number"

                            name="pricePresale"

                            value={formData.pricePresale}

                            onChange={handleChange}

                            min="0"

                            step="0.5"

                            className="w-full bg-black border-2 border-[#FFFF00] text-white px-3 py-2 font-mono focus:outline-none"

                        />

                    </div>

                    <div>

                        <label className="block text-[#FFFF00] text-xs font-mono font-bold mb-1 uppercase">

                            <DollarSign size={12} className="inline mr-1" /> Sur place (CHF)

                        </label>

                        <input

                            type="number"

                            name="priceDoor"

                            value={formData.priceDoor}

                            onChange={handleChange}

                            min="0"

                            step="0.5"

                            className="w-full bg-black border-2 border-[#FFFF00] text-white px-3 py-2 font-mono focus:outline-none"

                        />

                    </div>

                </div>


                {/* Status */}

                <div>

                    <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">Statut initial</label>

                    <div className="flex gap-2">

                        {['DRAFT', 'CONFIRMED'].map((s) => (

                            <button

                                key={s}

                                type="button"

                                onClick={() => setFormData(prev => ({ ...prev, status: s }))}

                                className={`flex-1 px-4 py-2 border-2 font-mono text-xs font-bold uppercase ${

                                    formData.status === s

                                        ? s === 'DRAFT' ? 'bg-gray-600 text-white border-gray-600' : 'bg-[#00FFFF] text-black border-[#00FFFF]'

                                        : 'bg-black text-white border-gray-700 hover:border-white'

                                }`}

                            >

                                {s === 'DRAFT' ? 'BROUILLON' : 'CONFIRMÉ'}

                            </button>

                        ))}

                    </div>

                </div>


                {/* Image */}

                <div>

                    <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">

                        <Image size={12} className="inline mr-1" /> URL Image (optionnel)

                    </label>

                    <input

                        type="url"

                        name="imageUrl"

                        value={formData.imageUrl}

                        onChange={handleChange}

                        placeholder="https://..."

                        className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-white mb-2"

                    />

                    <div className="grid grid-cols-6 gap-1">

                        {sampleImages.map((url, i) => (

                            <button

                                key={i}

                                type="button"

                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: url }))}

                                className={`h-10 bg-cover bg-center border-2 ${

                                    formData.imageUrl === url ? 'border-[#E91E63]' : 'border-gray-700 hover:border-white'

                                }`}

                                style={{ backgroundImage: `url(${url})` }}

                            />

                        ))}

                    </div>

                </div>


                {/* Description */}

                <div>

                    <label className="block text-gray-400 text-xs font-mono mb-1 uppercase">Description</label>

                    <textarea

                        name="description"

                        value={formData.description}

                        onChange={handleChange}

                        rows={3}

                        placeholder="Description de l'événement..."

                        className="w-full bg-black border border-gray-700 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-white resize-none"

                    />

                </div>


                {/* Actions */}

                <div className="flex gap-3 pt-4 border-t border-gray-800">

                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">

                        ANNULER

                    </Button>

                    <Button type="submit" variant="primary" disabled={loading || !formData.title || !formData.date} className="flex-1">

                        {loading ? 'CRÉATION...' : 'CRÉER'}

                    </Button>

                </div>

            </form>

        </Modal>

    );

};


export default CreateEventModal; 