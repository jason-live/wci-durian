(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.wciDurian = {})));
}(this, (function (exports) { 'use strict';

  var Interceptor = /** @class */ (function () {
      function Interceptor() {
      }
      Interceptor.prototype.getAop = function () {
          return this.handleMetadata();
      };
      Interceptor.prototype.handleMetadata = function () {
          var _this = this;
          return function () { return function (target, propertyKey) {
              var instances = Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey) || [];
              instances.push(_this);
              Reflect.defineMetadata(Interceptor.ICT_INSTANCES_KEY, instances, target, propertyKey);
          }; };
      };
      Interceptor.ICT_INSTANCES_KEY = Symbol.for('WCI:ICT_INSTANCES_KEY');
      return Interceptor;
  }());

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  var Reflect$1;
  (function (Reflect) {
      // Metadata Proposal
      // https://rbuckton.github.io/reflect-metadata/
      (function (factory) {
          var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
              typeof self === "object" ? self :
                  typeof this === "object" ? this :
                      Function("return this;")();
          var exporter = makeExporter(Reflect);
          if (typeof root.Reflect === "undefined") {
              root.Reflect = Reflect;
          }
          else {
              exporter = makeExporter(root.Reflect, exporter);
          }
          factory(exporter);
          function makeExporter(target, previous) {
              return function (key, value) {
                  if (typeof target[key] !== "function") {
                      Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                  }
                  if (previous)
                      previous(key, value);
              };
          }
      })(function (exporter) {
          var hasOwn = Object.prototype.hasOwnProperty;
          // feature test for Symbol support
          var supportsSymbol = typeof Symbol === "function";
          var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
          var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
          var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
          var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
          var downLevel = !supportsCreate && !supportsProto;
          var HashMap = {
              // create an object in dictionary mode (a.k.a. "slow" mode in v8)
              create: supportsCreate
                  ? function () { return MakeDictionary(Object.create(null)); }
                  : supportsProto
                      ? function () { return MakeDictionary({ __proto__: null }); }
                      : function () { return MakeDictionary({}); },
              has: downLevel
                  ? function (map, key) { return hasOwn.call(map, key); }
                  : function (map, key) { return key in map; },
              get: downLevel
                  ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                  : function (map, key) { return map[key]; },
          };
          // Load global or shim versions of Map, Set, and WeakMap
          var functionPrototype = Object.getPrototypeOf(Function);
          var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
          var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
          var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
          var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
          // [[Metadata]] internal slot
          // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
          var Metadata = new _WeakMap();
          /**
           * Applies a set of decorators to a property of a target object.
           * @param decorators An array of decorators.
           * @param target The target object.
           * @param propertyKey (Optional) The property key to decorate.
           * @param attributes (Optional) The property descriptor for the target key.
           * @remarks Decorators are applied in reverse order.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     Example = Reflect.decorate(decoratorsArray, Example);
           *
           *     // property (on constructor)
           *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
           *
           *     // property (on prototype)
           *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
           *
           *     // method (on constructor)
           *     Object.defineProperty(Example, "staticMethod",
           *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
           *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
           *
           *     // method (on prototype)
           *     Object.defineProperty(Example.prototype, "method",
           *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
           *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
           *
           */
          function decorate(decorators, target, propertyKey, attributes) {
              if (!IsUndefined(propertyKey)) {
                  if (!IsArray(decorators))
                      throw new TypeError();
                  if (!IsObject(target))
                      throw new TypeError();
                  if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                      throw new TypeError();
                  if (IsNull(attributes))
                      attributes = undefined;
                  propertyKey = ToPropertyKey(propertyKey);
                  return DecorateProperty(decorators, target, propertyKey, attributes);
              }
              else {
                  if (!IsArray(decorators))
                      throw new TypeError();
                  if (!IsConstructor(target))
                      throw new TypeError();
                  return DecorateConstructor(decorators, target);
              }
          }
          exporter("decorate", decorate);
          // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
          // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
          /**
           * A default metadata decorator factory that can be used on a class, class member, or parameter.
           * @param metadataKey The key for the metadata entry.
           * @param metadataValue The value for the metadata entry.
           * @returns A decorator function.
           * @remarks
           * If `metadataKey` is already defined for the target and target key, the
           * metadataValue for that key will be overwritten.
           * @example
           *
           *     // constructor
           *     @Reflect.metadata(key, value)
           *     class Example {
           *     }
           *
           *     // property (on constructor, TypeScript only)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         static staticProperty;
           *     }
           *
           *     // property (on prototype, TypeScript only)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         property;
           *     }
           *
           *     // method (on constructor)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         static staticMethod() { }
           *     }
           *
           *     // method (on prototype)
           *     class Example {
           *         @Reflect.metadata(key, value)
           *         method() { }
           *     }
           *
           */
          function metadata(metadataKey, metadataValue) {
              function decorator(target, propertyKey) {
                  if (!IsObject(target))
                      throw new TypeError();
                  if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                      throw new TypeError();
                  OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
              }
              return decorator;
          }
          exporter("metadata", metadata);
          /**
           * Define a unique metadata entry on the target.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param metadataValue A value that contains attached metadata.
           * @param target The target object on which to define metadata.
           * @param propertyKey (Optional) The property key for the target.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     Reflect.defineMetadata("custom:annotation", options, Example);
           *
           *     // property (on constructor)
           *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
           *
           *     // property (on prototype)
           *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
           *
           *     // method (on constructor)
           *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
           *
           *     // method (on prototype)
           *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
           *
           *     // decorator factory as metadata-producing annotation.
           *     function MyAnnotation(options): Decorator {
           *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
           *     }
           *
           */
          function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          exporter("defineMetadata", defineMetadata);
          /**
           * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.hasMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function hasMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryHasMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasMetadata", hasMetadata);
          /**
           * Gets a value indicating whether the target object has the provided metadata key defined.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function hasOwnMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasOwnMetadata", hasOwnMetadata);
          /**
           * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function getMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryGetMetadata(metadataKey, target, propertyKey);
          }
          exporter("getMetadata", getMetadata);
          /**
           * Gets the metadata value for the provided metadata key on the target object.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getOwnMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function getOwnMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("getOwnMetadata", getOwnMetadata);
          /**
           * Gets the metadata keys defined on the target object or its prototype chain.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns An array of unique metadata keys.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getMetadataKeys(Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getMetadataKeys(Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getMetadataKeys(Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getMetadataKeys(Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getMetadataKeys(Example.prototype, "method");
           *
           */
          function getMetadataKeys(target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryMetadataKeys(target, propertyKey);
          }
          exporter("getMetadataKeys", getMetadataKeys);
          /**
           * Gets the unique metadata keys defined on the target object.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns An array of unique metadata keys.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.getOwnMetadataKeys(Example);
           *
           *     // property (on constructor)
           *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
           *
           */
          function getOwnMetadataKeys(target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              return OrdinaryOwnMetadataKeys(target, propertyKey);
          }
          exporter("getOwnMetadataKeys", getOwnMetadataKeys);
          /**
           * Deletes the metadata entry from the target object with the provided key.
           * @param metadataKey A key used to store and retrieve metadata.
           * @param target The target object on which the metadata is defined.
           * @param propertyKey (Optional) The property key for the target.
           * @returns `true` if the metadata entry was found and deleted; otherwise, false.
           * @example
           *
           *     class Example {
           *         // property declarations are not part of ES6, though they are valid in TypeScript:
           *         // static staticProperty;
           *         // property;
           *
           *         constructor(p) { }
           *         static staticMethod(p) { }
           *         method(p) { }
           *     }
           *
           *     // constructor
           *     result = Reflect.deleteMetadata("custom:annotation", Example);
           *
           *     // property (on constructor)
           *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
           *
           *     // property (on prototype)
           *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
           *
           *     // method (on constructor)
           *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
           *
           *     // method (on prototype)
           *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
           *
           */
          function deleteMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target))
                  throw new TypeError();
              if (!IsUndefined(propertyKey))
                  propertyKey = ToPropertyKey(propertyKey);
              var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return false;
              if (!metadataMap.delete(metadataKey))
                  return false;
              if (metadataMap.size > 0)
                  return true;
              var targetMetadata = Metadata.get(target);
              targetMetadata.delete(propertyKey);
              if (targetMetadata.size > 0)
                  return true;
              Metadata.delete(target);
              return true;
          }
          exporter("deleteMetadata", deleteMetadata);
          function DecorateConstructor(decorators, target) {
              for (var i = decorators.length - 1; i >= 0; --i) {
                  var decorator = decorators[i];
                  var decorated = decorator(target);
                  if (!IsUndefined(decorated) && !IsNull(decorated)) {
                      if (!IsConstructor(decorated))
                          throw new TypeError();
                      target = decorated;
                  }
              }
              return target;
          }
          function DecorateProperty(decorators, target, propertyKey, descriptor) {
              for (var i = decorators.length - 1; i >= 0; --i) {
                  var decorator = decorators[i];
                  var decorated = decorator(target, propertyKey, descriptor);
                  if (!IsUndefined(decorated) && !IsNull(decorated)) {
                      if (!IsObject(decorated))
                          throw new TypeError();
                      descriptor = decorated;
                  }
              }
              return descriptor;
          }
          function GetOrCreateMetadataMap(O, P, Create) {
              var targetMetadata = Metadata.get(O);
              if (IsUndefined(targetMetadata)) {
                  if (!Create)
                      return undefined;
                  targetMetadata = new _Map();
                  Metadata.set(O, targetMetadata);
              }
              var metadataMap = targetMetadata.get(P);
              if (IsUndefined(metadataMap)) {
                  if (!Create)
                      return undefined;
                  metadataMap = new _Map();
                  targetMetadata.set(P, metadataMap);
              }
              return metadataMap;
          }
          // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
          function OrdinaryHasMetadata(MetadataKey, O, P) {
              var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
              if (hasOwn)
                  return true;
              var parent = OrdinaryGetPrototypeOf(O);
              if (!IsNull(parent))
                  return OrdinaryHasMetadata(MetadataKey, parent, P);
              return false;
          }
          // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
          function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return false;
              return ToBoolean(metadataMap.has(MetadataKey));
          }
          // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
          function OrdinaryGetMetadata(MetadataKey, O, P) {
              var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
              if (hasOwn)
                  return OrdinaryGetOwnMetadata(MetadataKey, O, P);
              var parent = OrdinaryGetPrototypeOf(O);
              if (!IsNull(parent))
                  return OrdinaryGetMetadata(MetadataKey, parent, P);
              return undefined;
          }
          // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
          function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return undefined;
              return metadataMap.get(MetadataKey);
          }
          // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
          function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
              metadataMap.set(MetadataKey, MetadataValue);
          }
          // 3.1.6.1 OrdinaryMetadataKeys(O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
          function OrdinaryMetadataKeys(O, P) {
              var ownKeys = OrdinaryOwnMetadataKeys(O, P);
              var parent = OrdinaryGetPrototypeOf(O);
              if (parent === null)
                  return ownKeys;
              var parentKeys = OrdinaryMetadataKeys(parent, P);
              if (parentKeys.length <= 0)
                  return ownKeys;
              if (ownKeys.length <= 0)
                  return parentKeys;
              var set = new _Set();
              var keys = [];
              for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                  var key = ownKeys_1[_i];
                  var hasKey = set.has(key);
                  if (!hasKey) {
                      set.add(key);
                      keys.push(key);
                  }
              }
              for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                  var key = parentKeys_1[_a];
                  var hasKey = set.has(key);
                  if (!hasKey) {
                      set.add(key);
                      keys.push(key);
                  }
              }
              return keys;
          }
          // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
          // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
          function OrdinaryOwnMetadataKeys(O, P) {
              var keys = [];
              var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
              if (IsUndefined(metadataMap))
                  return keys;
              var keysObj = metadataMap.keys();
              var iterator = GetIterator(keysObj);
              var k = 0;
              while (true) {
                  var next = IteratorStep(iterator);
                  if (!next) {
                      keys.length = k;
                      return keys;
                  }
                  var nextValue = IteratorValue(next);
                  try {
                      keys[k] = nextValue;
                  }
                  catch (e) {
                      try {
                          IteratorClose(iterator);
                      }
                      finally {
                          throw e;
                      }
                  }
                  k++;
              }
          }
          // 6 ECMAScript Data Typ0es and Values
          // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
          function Type(x) {
              if (x === null)
                  return 1 /* Null */;
              switch (typeof x) {
                  case "undefined": return 0 /* Undefined */;
                  case "boolean": return 2 /* Boolean */;
                  case "string": return 3 /* String */;
                  case "symbol": return 4 /* Symbol */;
                  case "number": return 5 /* Number */;
                  case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                  default: return 6 /* Object */;
              }
          }
          // 6.1.1 The Undefined Type
          // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
          function IsUndefined(x) {
              return x === undefined;
          }
          // 6.1.2 The Null Type
          // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
          function IsNull(x) {
              return x === null;
          }
          // 6.1.5 The Symbol Type
          // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
          function IsSymbol(x) {
              return typeof x === "symbol";
          }
          // 6.1.7 The Object Type
          // https://tc39.github.io/ecma262/#sec-object-type
          function IsObject(x) {
              return typeof x === "object" ? x !== null : typeof x === "function";
          }
          // 7.1 Type Conversion
          // https://tc39.github.io/ecma262/#sec-type-conversion
          // 7.1.1 ToPrimitive(input [, PreferredType])
          // https://tc39.github.io/ecma262/#sec-toprimitive
          function ToPrimitive(input, PreferredType) {
              switch (Type(input)) {
                  case 0 /* Undefined */: return input;
                  case 1 /* Null */: return input;
                  case 2 /* Boolean */: return input;
                  case 3 /* String */: return input;
                  case 4 /* Symbol */: return input;
                  case 5 /* Number */: return input;
              }
              var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
              var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
              if (exoticToPrim !== undefined) {
                  var result = exoticToPrim.call(input, hint);
                  if (IsObject(result))
                      throw new TypeError();
                  return result;
              }
              return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
          }
          // 7.1.1.1 OrdinaryToPrimitive(O, hint)
          // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
          function OrdinaryToPrimitive(O, hint) {
              if (hint === "string") {
                  var toString_1 = O.toString;
                  if (IsCallable(toString_1)) {
                      var result = toString_1.call(O);
                      if (!IsObject(result))
                          return result;
                  }
                  var valueOf = O.valueOf;
                  if (IsCallable(valueOf)) {
                      var result = valueOf.call(O);
                      if (!IsObject(result))
                          return result;
                  }
              }
              else {
                  var valueOf = O.valueOf;
                  if (IsCallable(valueOf)) {
                      var result = valueOf.call(O);
                      if (!IsObject(result))
                          return result;
                  }
                  var toString_2 = O.toString;
                  if (IsCallable(toString_2)) {
                      var result = toString_2.call(O);
                      if (!IsObject(result))
                          return result;
                  }
              }
              throw new TypeError();
          }
          // 7.1.2 ToBoolean(argument)
          // https://tc39.github.io/ecma262/2016/#sec-toboolean
          function ToBoolean(argument) {
              return !!argument;
          }
          // 7.1.12 ToString(argument)
          // https://tc39.github.io/ecma262/#sec-tostring
          function ToString(argument) {
              return "" + argument;
          }
          // 7.1.14 ToPropertyKey(argument)
          // https://tc39.github.io/ecma262/#sec-topropertykey
          function ToPropertyKey(argument) {
              var key = ToPrimitive(argument, 3 /* String */);
              if (IsSymbol(key))
                  return key;
              return ToString(key);
          }
          // 7.2 Testing and Comparison Operations
          // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
          // 7.2.2 IsArray(argument)
          // https://tc39.github.io/ecma262/#sec-isarray
          function IsArray(argument) {
              return Array.isArray
                  ? Array.isArray(argument)
                  : argument instanceof Object
                      ? argument instanceof Array
                      : Object.prototype.toString.call(argument) === "[object Array]";
          }
          // 7.2.3 IsCallable(argument)
          // https://tc39.github.io/ecma262/#sec-iscallable
          function IsCallable(argument) {
              // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
              return typeof argument === "function";
          }
          // 7.2.4 IsConstructor(argument)
          // https://tc39.github.io/ecma262/#sec-isconstructor
          function IsConstructor(argument) {
              // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
              return typeof argument === "function";
          }
          // 7.2.7 IsPropertyKey(argument)
          // https://tc39.github.io/ecma262/#sec-ispropertykey
          function IsPropertyKey(argument) {
              switch (Type(argument)) {
                  case 3 /* String */: return true;
                  case 4 /* Symbol */: return true;
                  default: return false;
              }
          }
          // 7.3 Operations on Objects
          // https://tc39.github.io/ecma262/#sec-operations-on-objects
          // 7.3.9 GetMethod(V, P)
          // https://tc39.github.io/ecma262/#sec-getmethod
          function GetMethod(V, P) {
              var func = V[P];
              if (func === undefined || func === null)
                  return undefined;
              if (!IsCallable(func))
                  throw new TypeError();
              return func;
          }
          // 7.4 Operations on Iterator Objects
          // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
          function GetIterator(obj) {
              var method = GetMethod(obj, iteratorSymbol);
              if (!IsCallable(method))
                  throw new TypeError(); // from Call
              var iterator = method.call(obj);
              if (!IsObject(iterator))
                  throw new TypeError();
              return iterator;
          }
          // 7.4.4 IteratorValue(iterResult)
          // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
          function IteratorValue(iterResult) {
              return iterResult.value;
          }
          // 7.4.5 IteratorStep(iterator)
          // https://tc39.github.io/ecma262/#sec-iteratorstep
          function IteratorStep(iterator) {
              var result = iterator.next();
              return result.done ? false : result;
          }
          // 7.4.6 IteratorClose(iterator, completion)
          // https://tc39.github.io/ecma262/#sec-iteratorclose
          function IteratorClose(iterator) {
              var f = iterator["return"];
              if (f)
                  f.call(iterator);
          }
          // 9.1 Ordinary Object Internal Methods and Internal Slots
          // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
          // 9.1.1.1 OrdinaryGetPrototypeOf(O)
          // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
          function OrdinaryGetPrototypeOf(O) {
              var proto = Object.getPrototypeOf(O);
              if (typeof O !== "function" || O === functionPrototype)
                  return proto;
              // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
              // Try to determine the superclass constructor. Compatible implementations
              // must either set __proto__ on a subclass constructor to the superclass constructor,
              // or ensure each class has a valid `constructor` property on its prototype that
              // points back to the constructor.
              // If this is not the same as Function.[[Prototype]], then this is definately inherited.
              // This is the case when in ES6 or when using __proto__ in a compatible browser.
              if (proto !== functionPrototype)
                  return proto;
              // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
              var prototype = O.prototype;
              var prototypeProto = prototype && Object.getPrototypeOf(prototype);
              if (prototypeProto == null || prototypeProto === Object.prototype)
                  return proto;
              // If the constructor was not a function, then we cannot determine the heritage.
              var constructor = prototypeProto.constructor;
              if (typeof constructor !== "function")
                  return proto;
              // If we have some kind of self-reference, then we cannot determine the heritage.
              if (constructor === O)
                  return proto;
              // we have a pretty good guess at the heritage.
              return constructor;
          }
          // naive Map shim
          function CreateMapPolyfill() {
              var cacheSentinel = {};
              var arraySentinel = [];
              var MapIterator = /** @class */ (function () {
                  function MapIterator(keys, values, selector) {
                      this._index = 0;
                      this._keys = keys;
                      this._values = values;
                      this._selector = selector;
                  }
                  MapIterator.prototype["@@iterator"] = function () { return this; };
                  MapIterator.prototype[iteratorSymbol] = function () { return this; };
                  MapIterator.prototype.next = function () {
                      var index = this._index;
                      if (index >= 0 && index < this._keys.length) {
                          var result = this._selector(this._keys[index], this._values[index]);
                          if (index + 1 >= this._keys.length) {
                              this._index = -1;
                              this._keys = arraySentinel;
                              this._values = arraySentinel;
                          }
                          else {
                              this._index++;
                          }
                          return { value: result, done: false };
                      }
                      return { value: undefined, done: true };
                  };
                  MapIterator.prototype.throw = function (error) {
                      if (this._index >= 0) {
                          this._index = -1;
                          this._keys = arraySentinel;
                          this._values = arraySentinel;
                      }
                      throw error;
                  };
                  MapIterator.prototype.return = function (value) {
                      if (this._index >= 0) {
                          this._index = -1;
                          this._keys = arraySentinel;
                          this._values = arraySentinel;
                      }
                      return { value: value, done: true };
                  };
                  return MapIterator;
              }());
              return /** @class */ (function () {
                  function Map() {
                      this._keys = [];
                      this._values = [];
                      this._cacheKey = cacheSentinel;
                      this._cacheIndex = -2;
                  }
                  Object.defineProperty(Map.prototype, "size", {
                      get: function () { return this._keys.length; },
                      enumerable: true,
                      configurable: true
                  });
                  Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                  Map.prototype.get = function (key) {
                      var index = this._find(key, /*insert*/ false);
                      return index >= 0 ? this._values[index] : undefined;
                  };
                  Map.prototype.set = function (key, value) {
                      var index = this._find(key, /*insert*/ true);
                      this._values[index] = value;
                      return this;
                  };
                  Map.prototype.delete = function (key) {
                      var index = this._find(key, /*insert*/ false);
                      if (index >= 0) {
                          var size = this._keys.length;
                          for (var i = index + 1; i < size; i++) {
                              this._keys[i - 1] = this._keys[i];
                              this._values[i - 1] = this._values[i];
                          }
                          this._keys.length--;
                          this._values.length--;
                          if (key === this._cacheKey) {
                              this._cacheKey = cacheSentinel;
                              this._cacheIndex = -2;
                          }
                          return true;
                      }
                      return false;
                  };
                  Map.prototype.clear = function () {
                      this._keys.length = 0;
                      this._values.length = 0;
                      this._cacheKey = cacheSentinel;
                      this._cacheIndex = -2;
                  };
                  Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                  Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                  Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                  Map.prototype["@@iterator"] = function () { return this.entries(); };
                  Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                  Map.prototype._find = function (key, insert) {
                      if (this._cacheKey !== key) {
                          this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                      }
                      if (this._cacheIndex < 0 && insert) {
                          this._cacheIndex = this._keys.length;
                          this._keys.push(key);
                          this._values.push(undefined);
                      }
                      return this._cacheIndex;
                  };
                  return Map;
              }());
              function getKey(key, _) {
                  return key;
              }
              function getValue(_, value) {
                  return value;
              }
              function getEntry(key, value) {
                  return [key, value];
              }
          }
          // naive Set shim
          function CreateSetPolyfill() {
              return /** @class */ (function () {
                  function Set() {
                      this._map = new _Map();
                  }
                  Object.defineProperty(Set.prototype, "size", {
                      get: function () { return this._map.size; },
                      enumerable: true,
                      configurable: true
                  });
                  Set.prototype.has = function (value) { return this._map.has(value); };
                  Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                  Set.prototype.delete = function (value) { return this._map.delete(value); };
                  Set.prototype.clear = function () { this._map.clear(); };
                  Set.prototype.keys = function () { return this._map.keys(); };
                  Set.prototype.values = function () { return this._map.values(); };
                  Set.prototype.entries = function () { return this._map.entries(); };
                  Set.prototype["@@iterator"] = function () { return this.keys(); };
                  Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                  return Set;
              }());
          }
          // naive WeakMap shim
          function CreateWeakMapPolyfill() {
              var UUID_SIZE = 16;
              var keys = HashMap.create();
              var rootKey = CreateUniqueKey();
              return /** @class */ (function () {
                  function WeakMap() {
                      this._key = CreateUniqueKey();
                  }
                  WeakMap.prototype.has = function (target) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                      return table !== undefined ? HashMap.has(table, this._key) : false;
                  };
                  WeakMap.prototype.get = function (target) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                      return table !== undefined ? HashMap.get(table, this._key) : undefined;
                  };
                  WeakMap.prototype.set = function (target, value) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                      table[this._key] = value;
                      return this;
                  };
                  WeakMap.prototype.delete = function (target) {
                      var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                      return table !== undefined ? delete table[this._key] : false;
                  };
                  WeakMap.prototype.clear = function () {
                      // NOTE: not a real clear, just makes the previous data unreachable
                      this._key = CreateUniqueKey();
                  };
                  return WeakMap;
              }());
              function CreateUniqueKey() {
                  var key;
                  do
                      key = "@@WeakMap@@" + CreateUUID();
                  while (HashMap.has(keys, key));
                  keys[key] = true;
                  return key;
              }
              function GetOrCreateWeakMapTable(target, create) {
                  if (!hasOwn.call(target, rootKey)) {
                      if (!create)
                          return undefined;
                      Object.defineProperty(target, rootKey, { value: HashMap.create() });
                  }
                  return target[rootKey];
              }
              function FillRandomBytes(buffer, size) {
                  for (var i = 0; i < size; ++i)
                      buffer[i] = Math.random() * 0xff | 0;
                  return buffer;
              }
              function GenRandomBytes(size) {
                  if (typeof Uint8Array === "function") {
                      if (typeof crypto !== "undefined")
                          return crypto.getRandomValues(new Uint8Array(size));
                      if (typeof msCrypto !== "undefined")
                          return msCrypto.getRandomValues(new Uint8Array(size));
                      return FillRandomBytes(new Uint8Array(size), size);
                  }
                  return FillRandomBytes(new Array(size), size);
              }
              function CreateUUID() {
                  var data = GenRandomBytes(UUID_SIZE);
                  // mark as random - RFC 4122 § 4.4
                  data[6] = data[6] & 0x4f | 0x40;
                  data[8] = data[8] & 0xbf | 0x80;
                  var result = "";
                  for (var offset = 0; offset < UUID_SIZE; ++offset) {
                      var byte = data[offset];
                      if (offset === 4 || offset === 6 || offset === 8)
                          result += "-";
                      if (byte < 16)
                          result += "0";
                      result += byte.toString(16).toLowerCase();
                  }
                  return result;
              }
          }
          // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
          function MakeDictionary(obj) {
              obj.__ = undefined;
              delete obj.__;
              return obj;
          }
      });
  })(Reflect$1 || (Reflect$1 = {}));

  /**
   * 类修饰器
   * @class Classes
   */
  var Classes = /** @class */ (function () {
      function Classes() {
      }
      /**
       * 类修饰器函数
       * @returns
       * @memberof Classes
       */
      Classes.prototype.getController = function () {
          return function (path) { return function (target) {
              Reflect.defineMetadata(Classes.CONTROLLER_KEY, path, target.prototype);
          }; };
      };
      /**
       * 类修饰器 key 值
       * @static
       * @memberof Classes
       */
      Classes.CONTROLLER_KEY = Symbol.for('WCI:CONTROLLER_KEY');
      return Classes;
  }());

  var Params = /** @class */ (function () {
      function Params() {
      }
      Params.prototype.getHeader = function () {
          return this.renderAnno(Params.HEADER_KEY);
      };
      Params.prototype.getPath = function () {
          return this.renderAnno(Params.PATH_KEY);
      };
      Params.prototype.getQuery = function () {
          return this.renderAnno(Params.QUERY_KEY);
      };
      Params.prototype.getBody = function () {
          return this.renderAnno(Params.BODY_KEY);
      };
      /**
       * 构建 matedata
       * @private
       * @param {*} key
       * @returns
       * @memberof Param
       */
      Params.prototype.renderAnno = function (key) {
          return function (paramName) { return function (target, propertyKey, paramIndex) {
              var params = Reflect.getMetadata(key, target, propertyKey) || {};
              params[paramName] = paramIndex;
              Reflect.defineMetadata(key, params, target, propertyKey);
          }; };
      };
      Params.HEADER_KEY = Symbol.for('WCI:HEADER_KEY');
      Params.PATH_KEY = Symbol.for('WCI:PATH_KEY');
      Params.QUERY_KEY = Symbol.for('WCI:QUERY_KEY');
      Params.BODY_KEY = Symbol.for('WCI:BODY_KEY');
      return Params;
  }());

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  var MethodType = /** @class */ (function () {
      function MethodType() {
      }
      MethodType.GET = 'get';
      MethodType.POST = 'post';
      MethodType.PUT = 'put';
      MethodType.DELETE = 'delete';
      return MethodType;
  }());

  var Methods = /** @class */ (function () {
      function Methods(cMap) {
          this.cMap = cMap;
      }
      Methods.prototype.getGet = function () {
          return this.renderAnno(MethodType.GET);
      };
      Methods.prototype.getPost = function () {
          return this.renderAnno(MethodType.POST);
      };
      Methods.prototype.getPut = function () {
          return this.renderAnno(MethodType.PUT);
      };
      Methods.prototype.getDel = function () {
          return this.renderAnno(MethodType.DELETE);
      };
      /**
       * 处理注解函数
       * @private
       * @param {*} method
       * @returns
       * @memberof Methods
       */
      Methods.prototype.renderAnno = function (method) {
          var _this = this;
          return function (path) {
              return function (target, propertyKey, decorator) {
                  _this.cMap.set(target, target);
                  var methods = Reflect.getMetadata(Methods.METHODS_KEY, target) || [];
                  methods.push(propertyKey);
                  Reflect.defineMetadata(Methods.METHOD_KEY, method, target, propertyKey);
                  Reflect.defineMetadata(Methods.METHODS_KEY, methods, target);
                  Reflect.defineMetadata(Methods.REQUEST_KEY, path, target, propertyKey);
                  var oldMethod = decorator.value;
                  decorator.value = function (instance) { return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                      var params, result;
                      return __generator(this, function (_a) {
                          switch (_a.label) {
                              case 0:
                                  // ctx对象赋值
                                  instance.ctx = ctx;
                                  params = this.renderParams(ctx, target, propertyKey);
                                  return [4 /*yield*/, this.renderInterceptors(ctx, next, target, propertyKey)];
                              case 1:
                                  _a.sent();
                                  return [4 /*yield*/, oldMethod.apply(instance, params)];
                              case 2:
                                  result = _a.sent();
                                  ctx.response.body = result;
                                  return [2 /*return*/];
                          }
                      });
                  }); }; };
              };
          };
      };
      /**
       * 处理拦截器
       * @private
       * @param {*} ctx
       * @param {*} next
       * @param {*} target
       * @param {*} propertyKey
       * @memberof Methods
       */
      Methods.prototype.renderInterceptors = function (ctx, next, target, propertyKey) {
          return __awaiter(this, void 0, void 0, function () {
              var icts;
              var _this = this;
              return __generator(this, function (_a) {
                  icts = Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey);
                  if (icts) {
                      icts.map(function (ins) { return __awaiter(_this, void 0, void 0, function () {
                          return __generator(this, function (_a) {
                              switch (_a.label) {
                                  case 0: return [4 /*yield*/, ins.handleInterceptor(ctx, next)];
                                  case 1:
                                      _a.sent();
                                      return [2 /*return*/];
                              }
                          });
                      }); });
                  }
                  return [2 /*return*/];
              });
          });
      };
      /**
       * 处理请求头参数
       * @private
       * @param {*} ctx
       * @param {*} target
       * @param {*} propertyKey
       * @returns
       * @memberof Methods
       */
      Methods.prototype.renderParams = function (ctx, target, propertyKey) {
          var params = [];
          // 请求头参数
          var headerParams = Reflect.getMetadata(Params.HEADER_KEY, target, propertyKey);
          if (headerParams) {
              Object.keys(headerParams).map(function (key) { return (params[headerParams[key]] = ctx.request.header[key]); });
          }
          // 路径参数
          var pathParams = Reflect.getMetadata(Params.PATH_KEY, target, propertyKey);
          if (pathParams) {
              Object.keys(pathParams).map(function (key) { return (params[pathParams[key]] = ctx.params[key]); });
          }
          // 查询参数
          var queryParams = Reflect.getMetadata(Params.QUERY_KEY, target, propertyKey);
          if (queryParams) {
              Object.keys(queryParams).map(function (key) { return (params[queryParams[key]] = ctx.query[key]); });
          }
          // 请求体 body
          var bodyParams = Reflect.getMetadata(Params.BODY_KEY, target, propertyKey);
          if (bodyParams) {
              Object.keys(bodyParams).map(function (key) { return (params[bodyParams[key]] = ctx.request.body); });
          }
          return params;
      };
      Methods.REQUEST_KEY = Symbol.for('WCI:REQUEST_KEY');
      Methods.METHOD_KEY = Symbol.for('WCI:METHOD_KEY');
      Methods.METHODS_KEY = Symbol.for('WCI:METHODS_KEY');
      return Methods;
  }());

  /**
   * WciDurian
   * @class WciDurian
   */
  var WciDurian = /** @class */ (function () {
      function WciDurian() {
      }
      WciDurian.metadatas = function () {
          var arr = [];
          Array
              .from(this.cMap.values())
              .map(function (c) { return Reflect.getMetadata(Methods.METHODS_KEY, c)
              .map(function (methodName) {
              // 初始化路由参数
              var method = c[methodName](c);
              var ctrPath = Reflect.getMetadata(Classes.CONTROLLER_KEY, c);
              var methodType = Reflect.getMetadata(Methods.METHOD_KEY, c, methodName);
              var path = Reflect.getMetadata(Methods.REQUEST_KEY, c, methodName);
              arr.push({ ctrPath: ctrPath, methodType: methodType, path: path, method: method });
          }); });
          return arr;
      };
      WciDurian.cMap = new Map();
      WciDurian.classes = new Classes();
      WciDurian.params = new Params();
      WciDurian.methods = new Methods(WciDurian.cMap);
      return WciDurian;
  }());
  var ControllerMapping = WciDurian.classes.getController();
  var Get = WciDurian.methods.getGet();
  var Post = WciDurian.methods.getPost();
  var Put = WciDurian.methods.getPut();
  var Del = WciDurian.methods.getDel();
  var RequestHeader = WciDurian.params.getHeader();
  var RequestPath = WciDurian.params.getPath();
  var RequestQuery = WciDurian.params.getQuery();
  var RequestBody = WciDurian.params.getBody();

  exports.default = WciDurian;
  exports.ControllerMapping = ControllerMapping;
  exports.Get = Get;
  exports.Post = Post;
  exports.Put = Put;
  exports.Del = Del;
  exports.RequestHeader = RequestHeader;
  exports.RequestPath = RequestPath;
  exports.RequestQuery = RequestQuery;
  exports.RequestBody = RequestBody;
  exports.MethodType = MethodType;
  exports.WciDurianInterceptor = Interceptor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wci-durian.umd.js.map
