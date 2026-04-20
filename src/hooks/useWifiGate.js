import { useEffect, useState } from 'react';

export function useWifiGate() {
  const [isGymNetwork, setIsGymNetwork] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch('/api/network-check');
        const data = await response.json();
        setIsGymNetwork(Boolean(data.allowed));
      } catch (_error) {
        setIsGymNetwork(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return { isGymNetwork, loading };
}
