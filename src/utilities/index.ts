import { View } from '@types';

export const hasUrlParam = (param: string): boolean => {
    return window.location.search.includes(param);
};

export const getViewsObject = (views: View[]): Record<string, View> => {
    return views.reduce((acc: Record<string, View>, view: View): Record<string, View> => {
        acc[view.path] = view;
        return acc;
    }, {} as Record<string, View>);
};