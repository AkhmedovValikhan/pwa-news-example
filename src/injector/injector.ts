import "reflect-metadata";

// tslint:disable-next-line:ban-types
type ClassInstance = Object;

export interface Newable<T> {
    // tslint:disable-next-line:callable-types
    new(...args: any[]): T;
}

export interface BindCases<T> {
    to: (instance: T) => void;
}

// tslint:disable-next-line:quotemark
const PROPERTY_TYPE_METADATA = 'design:type';
const INJECTOR_GLOBAL_NAME = '__INJECTOR_SERVICE_LOCATOR';
let serviceLocator: Map<string, ClassInstance>;

// tslint:disable-next-line:ban-types
type InjectionSubject<T> = (Function | Newable<T>) & { INJECTOR_UNIQUE_ID?: string };

// Instantiate global dictionary if it's not exist
if (!(window as any)[INJECTOR_GLOBAL_NAME] as any) {
    (window as any)[INJECTOR_GLOBAL_NAME] = new Map();
}
serviceLocator = (window as any)[INJECTOR_GLOBAL_NAME];

// injector is used to bind a class to an instance
// the instance is stored in our map (serviceLocator)
export const injector = {
    bind: <T>(type: InjectionSubject<T>): BindCases<T> => {
        return {
            to: (instance: T): void => {
                // Unique key is primarily a predefined id set in the class
                // or a the class name as a fallback
                const injectionKey = type.INJECTOR_UNIQUE_ID || type.name;
                // Checking if we already have an instance of class assigned to the injection key
                if (serviceLocator.has(injectionKey)) {
                    // Throwing an error if we do
                    const prevBind = serviceLocator.get(injectionKey);
                    throw new Error(injectionKey + ' already has been bound to ' + prevBind);
                }
                // Adding the instance to the map using the injectionKey
                serviceLocator.set(injectionKey, instance);
            }
        };
    },
    clean: () => {
        serviceLocator.clear();
    },
    resolve: <T>(type: InjectionSubject<T>): T => {
        const injectionKey = type.INJECTOR_UNIQUE_ID || type.name;
        return serviceLocator.get(injectionKey) as T;
    }
};

/**
 * Use this decorator inside stencil/react components to get instance from service registry
 */
export function Inject() {
    return function (proto: any, key: string): void {
        // Fetching the meta data of the class
        const classConstructor: InjectionSubject<any> = Reflect.getMetadata(PROPERTY_TYPE_METADATA, proto, key);
        if (!classConstructor) {
            throw new Error('cannot find type of propperty ' + key + ' in ' + proto);
        }
        const resolve = (): ClassInstance => {
            // Unique key is primarily a predefined id set in the class
            // or a the class name as a fallback
            const injectionKey = classConstructor.INJECTOR_UNIQUE_ID || classConstructor.name;
            // Fetching the instance of the class from the map using the injection key
            const instance = serviceLocator.get(injectionKey);
            if (!instance) {
                throw new Error('cannot find binded instance for ' + injectionKey);
            }
            return instance;
        };

        defineProperty(proto, key, resolve);
    };
}

function defineProperty(
    proto: any,
    key: string,
    resolve: () => ClassInstance,
) {
    function getter() {
        return resolve();
    }

    function setter(_newInstance: ClassInstance) {
        throw new Error('Attempt to explicitly set value of injected member');
    }

    Object.defineProperty(proto, key, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter,
    });
}
