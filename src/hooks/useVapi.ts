import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    vapiRef.current = new Vapi("1382fbd1-72e6-45fc-a228-fe945af2130f");

    vapiRef.current.on("call-end", () => {
      setIsActive(false);
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    if (vapiRef.current && !isActive) {
      await vapiRef.current.start("77b165e8-291c-4c34-ba76-e0245ae43beb");
      setIsActive(true);
    }
  };

  const stopCall = () => {
    if (vapiRef.current && isActive) {
      vapiRef.current.stop();
      setIsActive(false);
    }
  };

  const toggleCall = async () => {
    if (isActive) {
      stopCall();
    } else {
      await startCall();
    }
  };

  return {
    isActive,
    startCall,
    stopCall,
    toggleCall
  };
}
