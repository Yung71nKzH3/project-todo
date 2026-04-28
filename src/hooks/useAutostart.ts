import { useState, useEffect } from 'react';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

export function useAutostart() {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const status = await isEnabled();
            setEnabled(status);
        } catch (error) {
            console.error('Failed to check autostart status:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAutostart = async () => {
        try {
            if (enabled) {
                await disable();
            } else {
                await enable();
            }
            setEnabled(!enabled);
        } catch (error) {
            console.error('Failed to toggle autostart:', error);
        }
    };

    return {
        enabled,
        loading,
        toggleAutostart
    };
}
