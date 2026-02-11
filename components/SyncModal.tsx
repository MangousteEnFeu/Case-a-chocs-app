import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { HeedsEvent } from '../types';

interface SyncModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    event: HeedsEvent | null;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onConfirm, event }) => {
    if (!event) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="CONFIRMER LA SYNCHRO">
            <div className="text-center">
                <div className="flex justify-center mb-6 text-[#FFFF00]">
                    <AlertTriangle size={56} strokeWidth={1.5} />
                </div>

                <p className="text-gray-300 font-mono text-sm mb-6 uppercase">
                    Vous êtes sur le point d'envoyer cet événement vers <span className="text-[#E91E63] font-bold">PETZI</span> :
                </p>

                <div className="bg-[#111] border-2 border-dashed border-gray-700 p-4 mb-8 text-left">
                    <h3 className="text-xl text-white font-['Anton'] uppercase mb-1">{event.title}</h3>
                    <p className="text-xs font-mono text-gray-400 mb-3">{event.date} • {event.venue}</p>

                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                            <span>PRÉVENTE</span>
                            <span className="text-white">CHF {event.pricing.presale}.-</span>
                        </div>
                        <div className="flex justify-between">
                            <span>SUR PLACE</span>
                            <span className="text-white">CHF {event.pricing.door}.-</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={onClose} className="flex-1">ANNULER</Button>
                    <Button variant="primary" onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2">
                        ENVOYER <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SyncModal;