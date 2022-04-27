import { useEffect } from "react";
import { useThrottledCallback } from "use-debounce/lib";
import { useRegisterKeyListener } from "../../GlobalKeyListener";
import { isNavigateBackwardsKey, isNavigateForwardsKey } from "./keyMap";

type NavigateFn = () => boolean;
const throttleTimeInterval = 400;

const useThrottledNavigate = (navigateFn: NavigateFn) =>
    useThrottledCallback(navigateFn, throttleTimeInterval, {
        leading: true,
        trailing: false,
    });

export const useNavigationKeys = (
    navigateForward: NavigateFn,
    navigateBackward: NavigateFn
): void => {
    const [addKeyListener, removeKeyListener] = useRegisterKeyListener();

    const throttledNavigateBackward = useThrottledNavigate(navigateBackward);
    const throttledNavigateForward = useThrottledNavigate(navigateForward);

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (isNavigateBackwardsKey(event)) {
                const handled = throttledNavigateBackward();
                if (handled) {
                    event.preventDefault();
                }
                return;
            }

            if (isNavigateForwardsKey(event)) {
                const handled = throttledNavigateForward();
                if (handled) {
                    event.preventDefault();
                }
                return;
            }
        };

        addKeyListener(handleKey);
        return () => removeKeyListener(handleKey);
    }, [
        throttledNavigateBackward,
        throttledNavigateForward,
        addKeyListener,
        removeKeyListener,
    ]);
};
