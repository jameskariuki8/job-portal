import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import './gigStatusManager.scss';

const GigStatusManager = ({ gig, onStatusUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const queryClient = useQueryClient();

    const updateStatusMutation = useMutation({
        mutationFn: (status) => {
            return newRequest.patch(`/gigs/${gig._id}/status`, { status });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['myGigs']);
            if (onStatusUpdate) {
                onStatusUpdate(data);
            }
        },
        onError: (error) => {
            console.error('Error updating gig status:', error);
            alert('Failed to update gig status');
        }
    });

    const handleStatusChange = async (newStatus) => {
        if (newStatus === gig.status) return;
        
        setIsUpdating(true);
        try {
            await updateStatusMutation.mutateAsync(newStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return '#28a745';
            case 'in_progress':
                return '#ffc107';
            case 'completed':
                return '#17a2b8';
            default:
                return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    return (
        <div className="gig-status-manager">
            <div className="status-header">
                <h3>Gig Status</h3>
                <div 
                    className="current-status"
                    style={{ backgroundColor: getStatusColor(gig.status) }}
                >
                    {getStatusText(gig.status)}
                </div>
            </div>
            
            <div className="status-actions">
                <button
                    className={`status-btn ${gig.status === 'available' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('available')}
                    disabled={isUpdating || gig.status === 'available'}
                >
                    Available
                </button>
                
                <button
                    className={`status-btn ${gig.status === 'in_progress' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={isUpdating || gig.status === 'in_progress'}
                >
                    In Progress
                </button>
                
                <button
                    className={`status-btn ${gig.status === 'completed' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('completed')}
                    disabled={isUpdating || gig.status === 'completed'}
                >
                    Completed
                </button>
            </div>
            
            {isUpdating && (
                <div className="updating-indicator">
                    <span className="spinner"></span>
                    Updating status...
                </div>
            )}
        </div>
    );
};

export default GigStatusManager;




