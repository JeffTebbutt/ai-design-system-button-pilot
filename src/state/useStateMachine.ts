import { useState, useCallback } from "react";

type StateMachine = {
  initial: string;
  states: {
    [key: string]: {
      on?: {
        [event: string]: string;
      };
      meta?: {
        blocksInteraction?: boolean;
      };
    };
  };
};

export function useStateMachine(machine: StateMachine) {
  const [state, setState] = useState(machine.initial);

  const send = useCallback(
    (event: string) => {
      const currentStateDef = machine.states[state];

      if (!currentStateDef) {
        console.warn(`Unknown state: ${state}`);
        return;
      }

      // Block USER interaction, but allow SYSTEM events (e.g. SET_*)
      if (
        currentStateDef.meta?.blocksInteraction &&
        !event.startsWith("SET_")
      ) {
        return;
      }

      const next = currentStateDef.on?.[event];

      // Prevent unnecessary or invalid transitions
      if (!next || next === state) {
        return;
      }

      setState(next);
    },
    [state, machine]
  );

  return { state, send };
}