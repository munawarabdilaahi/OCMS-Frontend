export function FieldError({ id, message }) {
    if (!message) return null;
    return <p id={id} className="text-sm text-destructive" role="alert">{message}</p>;
}

export function fieldErrorId(name) {
    return `${name}-error`;
}
