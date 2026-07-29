'use client';
import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="size-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                        {this.props.fallbackMessage || 'An unexpected error occurred. Please try refreshing the page.'}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        <RefreshCw />
                        Refresh Page
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}
