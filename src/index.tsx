import * as React from 'react';
import { render, hydrate } from 'react-dom';
import App from './App';
import { NewsService } from './services/NewsService';
import { injector } from 'propin';

if (!PRERENDER) {
    (() => {
        initializeInjector();
        const appRoot = document.getElementById('root');
        if (appRoot!.children.length) {
            hydrate(<App />, appRoot);
        } else {
            render(<App />, appRoot);
        }
        initializeServiceWorker();
    })()
}

export default function () {
    injector.bind(NewsService).toInstance({
        getArticles: () => Promise.resolve([]),
        getHeadlines: () => Promise.resolve([]),
        getSources: () => Promise.resolve([]),
    } as Partial<NewsService> as NewsService);
    render(<App />, document.getElementById('root'));
}

function initializeInjector() {
    const API_URL = 'https://newsapi.org/v2';
    const API_KEY = '14cb7fafddd34cc7b95f9a0a9b927d88';
    injector.bind(NewsService).toInstance(new NewsService(API_URL, API_KEY));
}

function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            try {
                navigator.serviceWorker.register('/sw.js')
            } catch (registrationError) {
                console.log('SW registration failed: ', registrationError);
            }
        });
    };
}