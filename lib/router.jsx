'use client';
import NextLink from 'next/link';
import { redirect, usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation';
import { useEffect } from 'react';
export function Link({ to, href, children, ...props }) {
    return (<NextLink href={href || to || '#'} {...props}>
      {children}
    </NextLink>);
}
export function NavLink({ to, className, children, ...props }) {
    const pathname = usePathname() || '/';
    const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
    const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
    return (<NextLink href={to || '#'} className={resolvedClassName} {...props}>
      {children}
    </NextLink>);
}
export function Navigate({ to, replace = true }) {
    const router = useRouter();
    useEffect(() => {
        if (replace)
            router.replace(to);
        else
            router.push(to);
    }, [replace, router, to]);
    return null;
}
export function useNavigate() {
    const router = useRouter();
    return (to, options = {}) => {
        if (typeof to === 'number') {
            router.back();
            return;
        }
        if (options.replace)
            router.replace(to);
        else
            router.push(to);
    };
}
export function useLocation() {
    const pathname = usePathname() || '/';
    const searchParams = useNextSearchParams();
    const search = searchParams?.toString();
    return {
        pathname,
        search: search ? `?${search}` : '',
        state: null,
    };
}
export function useSearchParams() {
    return [useNextSearchParams(), () => undefined];
}
export function useParams() {
    const pathname = usePathname() || '/';
    const parts = pathname.split('/').filter(Boolean).map(decodeURIComponent);
    const value = parts[1];
    return {
        id: value,
        studentId: value,
        teacherId: value,
        departmentCode: value,
        courseCode: value,
        invoiceNumber: value,
    };
}
export function Outlet() {
    return null;
}
export { redirect, NextLink };
