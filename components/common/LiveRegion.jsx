export function LiveRegion({ children, role = 'status', 'aria-live': ariaLive = 'polite', 'aria-atomic': ariaAtomic = true }) {
    return (
        <div
            role={role}
            aria-live={ariaLive}
            aria-atomic={ariaAtomic}
            className="sr-only"
        >
            {children}
        </div>
    );
}
