import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeedsEvent, Venue, EventStatus } from '../types';
import EventCard from '../components/EventCard';
import SyncModal from '../components/SyncModal';
import CreateEventModal from '../components/CreateEventModal';
import { Search, Plus, RefreshCw, X, Save, Upload, Calendar, Clock, MapPin, Users, DollarSign, Music, FileText } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';

// ============================================================================
// EDIT EVENT MODAL COMPONENT - CORRIGÉ
// ============================================================================
interface EditEventModalProps {
    event: HeedsEvent;
    onClose: () => void;
    onSave: (event: HeedsEvent) => Promise<void>;
    onPushToPetzi: (event: HeedsEvent) => Promise<void>;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose, onSave, onPushToPetzi }) => {
    const [formData, setFormData] = useState<HeedsEvent>({ ...event });
    const [saving, setSaving] = useState(false);
    const [pushing, setPushing] = useState(false);

    // ✅ CORRIGÉ: Gestion simplifiée des champs
    const handleChange = (field: string, value: any) => {
        if (field === 'presale' || field === 'door') {
            // Gestion des prix
            setFormData(prev => ({
                ...prev,
                pricing: { ...prev.pricing, [field]: value }
            }));
        } else {
            // Tous les autres champs (y compris venue qui est un string)
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    const handlePush = async () => {
        setPushing(true);
        try {
            await onPushToPetzi(formData);
        } finally {
            setPushing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border-4 border-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#111] border-b-4 border-white p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white">MODIFIER ÉVÉNEMENT</h2>
                        <p className="text-[#E91E63] font-mono text-sm mt-1">{formData.id}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-[#E91E63] transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-white font-mono text-sm mb-2 flex items-center gap-2">
                                <FileText size={16} /> TITRE *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] focus:shadow-[4px_4px_0px_0px_#E91E63] transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-white font-mono text-sm mb-2">SOUS-TITRE</label>
                            <input
                                type="text"
                                value={formData.subtitle || ''}
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-mono text-sm mb-2 flex items-center gap-2">
                                <Music size={16} /> GENRE
                            </label>
                            <input
                                type="text"
                                value={formData.genre || ''}
                                onChange={(e) => handleChange('genre', e.target.value)}
                                className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-mono text-sm mb-2">STATUT</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all cursor-pointer"
                            >
                                <option value="DRAFT">DRAFT</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SYNCED">SYNCED</option>
                            </select>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="border-t-2 border-gray-800 pt-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} /> DATE & HORAIRES
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-white font-mono text-sm mb-2">DATE *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-mono text-sm mb-2 flex items-center gap-2">
                                    <Clock size={16} /> PORTES
                                </label>
                                <input
                                    type="time"
                                    value={formData.timeDoors}
                                    onChange={(e) => handleChange('timeDoors', e.target.value)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-mono text-sm mb-2 flex items-center gap-2">
                                    <Clock size={16} /> DÉBUT
                                </label>
                                <input
                                    type="time"
                                    value={formData.timeStart}
                                    onChange={(e) => handleChange('timeStart', e.target.value)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Venue - ✅ CORRIGÉ: venue est maintenant un string simple */}
                    <div className="border-t-2 border-gray-800 pt-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <MapPin size={20} /> LIEU
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white font-mono text-sm mb-2">SALLE *</label>
                                <select
                                    value={formData.venue}
                                    onChange={(e) => handleChange('venue', e.target.value as Venue)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all cursor-pointer"
                                >
                                    <option value="Grande Salle">Grande Salle (750 places)</option>
                                    <option value="QKC">QKC (100 places)</option>
                                    <option value="Interlope">Interlope (80 places)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white font-mono text-sm mb-2 flex items-center gap-2">
                                    <Users size={16} /> CAPACITÉ
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing - ✅ CORRIGÉ: utilise 'presale' et 'door' */}
                    <div className="border-t-2 border-gray-800 pt-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <DollarSign size={20} /> TARIFS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white font-mono text-sm mb-2">PRIX PRÉVENTE (CHF)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={formData.pricing.presale}
                                    onChange={(e) => handleChange('presale', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-mono text-sm mb-2">PRIX PORTE (CHF)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={formData.pricing.door}
                                    onChange={(e) => handleChange('door', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t-2 border-gray-800 pt-6">
                        <label className="block text-white font-mono text-sm mb-2">DESCRIPTION</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all resize-none"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="border-t-2 border-gray-800 pt-6">
                        <label className="block text-white font-mono text-sm mb-2">URL IMAGE</label>
                        <input
                            type="url"
                            value={formData.imageUrl || ''}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-black border-2 border-white text-white px-4 py-3 font-mono focus:outline-none focus:border-[#E91E63] transition-all"
                        />
                        {formData.imageUrl && (
                            <div className="mt-4 border-2 border-gray-800 p-2">
                                <img src={formData.imageUrl} alt="Preview" className="max-h-32 object-cover" />
                            </div>
                        )}
                    </div>

                    {/* PETZI Info */}
                    {formData.petziExternalId && (
                        <div className="border-t-2 border-gray-800 pt-6">
                            <div className="p-4 bg-[#00FFFF]/10 border-2 border-[#00FFFF]">
                                <p className="text-xs text-[#00FFFF] font-mono mb-1 font-bold">ID PETZI</p>
                                <p className="text-white font-mono">{formData.petziExternalId}</p>
                                {formData.lastSyncAt && (
                                    <p className="text-xs text-gray-500 font-mono mt-2">
                                        Dernière sync: {new Date(formData.lastSyncAt).toLocaleString('fr-CH')}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-[#111] border-t-4 border-white p-6 flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-white text-white font-mono font-bold hover:bg-white hover:text-black transition-all"
                    >
                        ANNULER
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-white text-black border-2 border-white font-mono font-bold hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Save size={18} className={saving ? 'animate-pulse' : ''} />
                        {saving ? 'SAUVEGARDE...' : 'ENREGISTRER'}
                    </button>
                    <button
                        onClick={handlePush}
                        disabled={pushing}
                        className="px-6 py-3 bg-[#E91E63] text-white border-2 border-[#E91E63] font-mono font-bold hover:bg-[#C2185B] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_white]"
                    >
                        <Upload size={18} className={pushing ? 'animate-spin' : ''} />
                        {pushing ? 'ENVOI...' : 'PUSH TO PETZI'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN EVENTS PAGE COMPONENT
// ============================================================================
const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<HeedsEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncingId, setSyncingId] = useState<string | null>(null);
    const [isBatchSyncing, setIsBatchSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'CONFIRMED' | 'SYNCED'>('ALL');
    const [editingEvent, setEditingEvent] = useState<HeedsEvent | null>(null);

    // Modal States
    const [syncModalOpen, setSyncModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<HeedsEvent | null>(null);

    const { showToast } = useToast();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        setLoading(true);
        api.getEvents()
            .then(setEvents)
            .finally(() => setLoading(false));
    };

    const handleSyncClick = (event: HeedsEvent) => {
        setSelectedEvent(event);
        setSyncModalOpen(true);
    };

    const handleConfirmSync = async () => {
        if (!selectedEvent) return;

        setSyncModalOpen(false);
        setSyncingId(selectedEvent.id);

        try {
            const updatedEvent = await api.syncEvent(selectedEvent.id);
            setEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
            showToast('success', `${selectedEvent.title} synchronisé avec PETZI !`);
        } catch (error) {
            console.error("Sync failed", error);
            showToast('error', `Échec de la synchronisation de ${selectedEvent.title}`);
        } finally {
            setSyncingId(null);
            setSelectedEvent(null);
        }
    };

    const handleSyncAllConfirmed = async () => {
        const confirmedEventsCount = events.filter(e => e.status === 'CONFIRMED').length;

        if (confirmedEventsCount === 0) {
            showToast('info', "Aucun événement CONFIRMED à synchroniser.");
            return;
        }

        setIsBatchSyncing(true);
        try {
            const updatedEvents = await api.syncAll();
            setEvents(prev => prev.map(e => {
                const updated = updatedEvents.find(u => u.id === e.id);
                return updated || e;
            }));
            showToast('success', `Synchronisation terminée : ${updatedEvents.length} événements envoyés à PETZI.`);
        } catch (error) {
            console.error("Batch sync failed", error);
            showToast('error', "Échec de la synchronisation batch. Vérifiez les logs.");
        } finally {
            setIsBatchSyncing(false);
        }
    };

    const handleCreateEvent = async (eventData: any) => {
        try {
            const newEvent = await api.createEvent(eventData);
            setEvents(prev => [newEvent, ...prev]);
            setCreateModalOpen(false);
            showToast('success', `Événement "${newEvent.title}" créé !`);
        } catch (error) {
            console.error("Create failed", error);
            showToast('error', "Échec de la création de l'événement");
        }
    };

    // ✅ HANDLER POUR SAUVEGARDER UN ÉVÉNEMENT MODIFIÉ
    const handleSaveEvent = async (event: HeedsEvent) => {
        try {
            const updatedEvent = await api.updateEvent(event);
            setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
            setEditingEvent(null);
            showToast('success', `Événement "${updatedEvent.title}" sauvegardé !`);
        } catch (error) {
            console.error("Save failed", error);
            showToast('error', "Échec de la sauvegarde");
            throw error;
        }
    };

    // ✅ HANDLER POUR SAUVEGARDER + PUSH VERS PETZI
    const handlePushToPetzi = async (event: HeedsEvent) => {
        try {
            // D'abord sauvegarder les modifications
            await api.updateEvent(event);
            // Ensuite synchroniser avec PETZI
            const syncedEvent = await api.syncEvent(event.id);
            setEvents(prev => prev.map(e => e.id === event.id ? syncedEvent : e));
            setEditingEvent(null);
            showToast('success', `Événement "${syncedEvent.title}" synchronisé avec PETZI !`);
        } catch (error) {
            console.error("Push to PETZI failed", error);
            showToast('error', "Échec de la synchronisation PETZI");
            throw error;
        }
    };

    // ✅ HANDLER POUR OUVRIR LE MODAL D'ÉDITION (appelé depuis EventCard)
    const handleEditClick = (event: HeedsEvent) => {
        setEditingEvent(event);
    };

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || e.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-[1600px] mx-auto min-h-screen">
            {/* Sync Modal */}
            <SyncModal
                isOpen={syncModalOpen}
                onClose={() => setSyncModalOpen(false)}
                onConfirm={handleConfirmSync}
                event={selectedEvent}
            />

            {/* Create Modal */}
            <CreateEventModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreateEvent}
            />

            {/* ✅ Edit Modal */}
            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={handleSaveEvent}
                    onPushToPetzi={handlePushToPetzi}
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b-4 border-white pb-6">
                <div>
                    <h1 className="text-6xl text-white mb-2 leading-none">EVENTS</h1>
                    <p className="text-[#E91E63] font-mono font-bold uppercase tracking-widest">HEEDS &gt;&gt; PETZI SYNC</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-stretch md:items-end">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black border-2 border-white text-white pl-4 pr-10 py-2 w-full md:w-64 font-mono uppercase focus:outline-none focus:border-[#E91E63] focus:shadow-[4px_4px_0px_0px_#E91E63] transition-all"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex items-center justify-center gap-2"
                            onClick={handleSyncAllConfirmed}
                            disabled={isBatchSyncing || loading}
                        >
                            <RefreshCw size={18} className={isBatchSyncing ? "animate-spin" : ""} />
                            SYNC ALL
                        </Button>

                        <Button
                            variant="secondary"
                            className="flex items-center justify-center gap-2"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus size={20} /> NEW
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-10">
                {['ALL', 'SYNCED', 'CONFIRMED', 'DRAFT'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 border-2 text-sm font-bold font-mono uppercase tracking-widest transition-all ${
                            filter === f
                                ? 'bg-white text-black border-white shadow-[4px_4px_0px_0px_#E91E63] translate-x-[-2px] translate-y-[-2px]'
                                : 'bg-black text-white border-white hover:bg-gray-900'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-96 bg-[#111] border-2 border-white animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onSync={handleSyncClick}
                            onEdit={handleEditClick}
                            isSyncing={syncingId === event.id || isBatchSyncing}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredEvents.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-800">
                    <p className="text-gray-500 font-mono uppercase">Aucun événement trouvé</p>
                </div>
            )}
        </div>
    );
};

export default EventsPage;