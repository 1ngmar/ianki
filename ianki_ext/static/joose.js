// Generated: Thu Sep 25 11:08:20 2008


// ##########################
// File: Joose.js
// ##########################
Joose = function () {
    this.cc              = null;  // the current class
    this.currentModule   = null
    this.top             = window;
    this.globalObjects   = [];
    
    this.anonymouseClassCounter = 0;
};

// Static helpers for Arrays
Joose.A = {};
Joose.A.each = function (array, func) {
    for(var i = 0; i < array.length; i++) {
        func(array[i], i)
    }
}
Joose.A.exists = function (array, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i] == value) {
            return true
        }
    }
    return false
}
Joose.A.concat = function (source, array) {
    source.push.apply(source, array)
    return source
}

Joose.A.grep = function (array, func) {
    var a = [];
    Joose.A.each(array, function (t) {
        if(func(t)) {
            a.push(t)
        }
    })
    return a
}
Joose.A.remove = function (array, removeEle) {
    var a = [];
    Joose.A.each(array, function (t) {
        if(t !== removeEle) {
            a.push(t)
        }
    })
    return a
}

// Static helpers for Strings
Joose.S = {};
Joose.S.uppercaseFirst = function (string) { 
    var first = string.substr(0,1);
    var rest  = string.substr(1,string.length-1);
    first = first.toUpperCase()
    return first + rest;
}

Joose.S.isString = function (thing) { 
    if(typeof thing == "string") {
        return true
    }
    return false
}

// Static helpers for objects
Joose.O = {};
Joose.O.each = function (object, func) {
    for(var i in object) {
        func(object[i], i)
    }
}

// Experimental!
Joose.O.extend = function (target, newObject) {
    for(var i in newObject) {
        var thing = newObject[i]
        target[i] = thing
    }
}


Joose.prototype = {
    
    addToString: function (object, func) {
        object.toString = func;
    },
    
    /*
     * Differentiates between instances and classes
     */
    isInstance: function(obj) {
        if(!obj.meta) {
            throw "isInstance only works with Joose objects and classes."
        }
        if(obj.constructor === obj.meta.c) {
            return true
        }
        return false
    },
    
    init: function () {
        this.builder = new Joose.Builder();
        this.builder.globalize()
    },
    // this needs to be updated in release.pl too, if files are added
    components: function () {
        return [
            "Joose.Builder",
            "Joose.Class",
            "Joose.Method",
            "Joose.ClassMethod",
            "Joose.Method",
            "Joose.Attribute",
            "Joose.Role",
            "Joose.SimpleRequest",
            "Joose.Gears",
            "Joose.Storage",
            "Joose.Storage.Unpacker",
            "Joose.Decorator",
            "Joose.Module",
            "Joose.Prototype",
            "Joose.TypeConstraint",
            "Joose.TypeCoercion"
        ]
    },

    loadComponents: function (basePath) {
    }
}

Joose.copyObject = function (source, target) {
    var keys = "";
    Joose.O.each(source, function (value, name) {  keys+=", "+name; target[name] = value })
    return target
};



Joose.emptyFunction = function () {};

var joose = new Joose();


Joose.bootstrap = function () {
    // Bootstrap
    var BOOT = new Joose.MetaClassBootstrap(); 
    
    BOOT.builder    = Joose.MetaClassBootstrap;

    Joose.MetaClass = BOOT.createClass("Joose.MetaClass");
   
    Joose.MetaClass.meta.addNonJooseSuperClass("Joose.MetaClassBootstrap", BOOT)
    
    Joose.MetaClass.meta.addMethod("initialize", function () { this._name = "Joose.MetaClass" })

    var META     = new Joose.MetaClass();
    
    META.builder = Joose.MetaClass;
    
    Joose.Class  = META.createClass("Joose.Class")
    Joose.Class.meta.addSuperClass(Joose.MetaClass);
    Joose.MetaClass.meta.addMethod("initialize", function () { this._name = "Joose.Class" })
}

Joose.bootstrap2 = function () {
    // Turn Joose.Method into a Joose.Class object
    Joose.Builder.Globals.joosify("Joose.Method", Joose.Method)
    Joose.Builder.Globals.joosify("Joose.Attribute", Joose.Attribute)
}

Joose.bootstrap3 = function () {
    // make the .meta object circular
}

/**
 * @name Joose.Class
 * @constructor
 */
/*
 * Joose.MetaClassBootstrap is used to bootstrap the Joose.Class with a regular JS constructor
 */
/** ignore */ // Do not display the Bootstrap classes in the docs
Joose.MetaClassBootstrap = function () {
    this._name            = "Joose.MetaClassBootstrap";
    this.methodNames      = [];
    this.attributeNames   = ["_name", "isAbstract", "isDetached", "methodNames", "attributeNames", "methods", "parentClasses", "roles", "c"];
    this.attributes       = {},
    this.methods          = {};
    this.classMethods     = {};
    this.parentClasses    = [];
    this.roles            = []; // All roles
    this.myRoles          = []; // Only roles applied to me directly
    this.isAbstract       = false;
    this.isDetached       = false;
}
/** @ignore */
Joose.MetaClassBootstrap.prototype = {
    
    toString: function () {
        if(this.meta) {
            return "a "+this.meta.className();
        }
        return "NoMeta"
    },
    
    /**
     * Returns the name of the class
     * @name className
     * @function
     * @memberof Joose.Class
     */
    /** @ignore */
    className: function () {
        return this._name
    },
    
    /**
     * Returns the name of the class (alias to className())
     * @name getName
     * @function
     * @memberof Joose.Class
     */
    /** @ignore */
    getName: function () {
        return this.className()
    },
    
    /**
     * Creates a new empty meta class object
     * @function
     * @name newMetaClass
     * @memberof Joose.Class
     */
    /** @ignore */
    newMetaClass: function () {
        
        var me  = this;
        
        var metaClassClass = this.builder;
        
        var c     = new metaClassClass();
        c.builder = metaClassClass;
        c._name   = this._name
        
        c.methodNames    = [];
        c.attributeNames = [];
        c.methods        = {};
        c.classMethods   = {};
        c.parentClasses  = [];
        c.roles          = [];
        c.myRoles        = [];
        c.attributes     = {};
        
        var myMeta = this.meta;
        if(!myMeta) {
            myMeta = this;
        }
        
        c.meta = myMeta
        
        return c
    },
    
    /**
     * Creates a new class object
     * @function
     * @name createClass
     * @param {function} optionalConstructor If provided will be used as the class constructor (You should not need this)
     * @param {Joose.Module} optionalModuleObject If provided the Module's name will be prepended to the class name 
     * @memberof Joose.Class
     */
    /** @ignore */
    createClass:    function (name, optionalConstructor, optionalModuleObject) {
        var meta  = this.newMetaClass();
        
        var c;
        
        if(optionalConstructor) {
            c = optionalConstructor
        } else {
            c = this.defaultClassFunctionBody()
            
            if(optionalModuleObject) {
                optionalModuleObject.addElement(c)
                // meta.setModule(optionalModuleObject)
            }
        }
        
        c.prototype.meta = meta
        c.meta    = meta;
        if(name == null) {
            meta._name = "__anonymous__" 
        } else {
            var className = name;
            if(optionalModuleObject) {
                className = optionalModuleObject.getName() + "." + name
            }
            meta._name = className;
        }
        meta.c = c;
        
        // store them in the global object if they have no namespace
        // They will end up in the Module __JOOSE_GLOBAL__
        if(!optionalModuleObject) {
            // Because the class Joose.Module might not exist yet, we use this temp store
            // that will later be in the global module
            joose.globalObjects.push(c)
        }
        
        meta.addInitializer();
        meta.addToString();
        meta.addDetacher();
        
        meta.validateClass();
        
        return c;
    },
    
    buildComplete: function () {
        // may be overriden in sublass
    },
    
    // intializes a class from the class definitions
    initializeFromProps: function (props) {
        this._initializeFromProps(props)
    },
    
    _initializeFromProps: function (props) {
        var me = this;
        if(props) {
            // For each property of the class constructor call the builder
            Joose.O.each(props, function (value, name) {
                var paras             = value;
                var customBuilderName = "handleProp"+name;
                // if the meta class of the current class implements handleProp+nameOfBuilder we use that
                if(me.meta.can(customBuilderName)) {
                    me[customBuilderName](paras, props)
                } else { // Otherwise use a builder from this file
                    throw new Error("Called invalid builder "+name+" while creating class "+me.meta.className())
                }
            })
            
            me.validateClass()
            
            me.buildComplete()
        }
    },
    
    /**
     * Returns a new instance of the class that this meta class instance is representing
     * @function
     * @name instantiate
     * @memberof Joose.Class
     */    
    instantiate: function () {
        //var o = new this.c.apply(this, arguments);
    
        // Ough! Calling a constructor with arbitrary arguments hack
        var f = function () {};
        f.prototype = this.c.prototype;
        f.prototype.constructor = this.c;
        var obj = new f();
        this.c.apply(obj, arguments);
        return obj;
    },
    
    /**
     * Returns the default constructor function for new classes. You might want to override this in derived meta classes
     * Default calls initialize on a new object upon construction.
     * The class object will stringify to it's name
     * @function
     * @name defaultClassFunctionBody
     * @memberof Joose.Class
     */
    /** @ignore */
    defaultClassFunctionBody: function () {
        var f = function () {
            this.initialize.apply(this, arguments);
        };
        joose.addToString(f, function () {
            return this.meta.className()
        })
        return f;
    },
    
    /**
     * Adds a toString method to a class
     * The default toString method will call the method stringify if available.
     * This make overriding stringification easier because toString cannot
     * be reliably overriden in some JS implementations.
     * @function
     * @name addToString
     * @memberof Joose.Class
     */
    /** @ignore */
    addToString: function () {
        this.addMethod("toString", function () {
            if(this.stringify) {
                return this.stringify()
            }
            return "a "+ this.meta.className()
        })
    },
    
    /**
     * Adds the method returned by the initializer method to the class
     * @function
     * @name addInitializer
     * @memberof Joose.Class
     */
    /** @ignore */
    addInitializer: function () {
        if(!this.c.prototype.initialize) {
            this.addMethod("initialize", this.initializer())
        }
    },
    
    /**
     * Adds a toString method to a class
     * @function
     * @name initializer
     * @memberof Joose.Class
     */
    /** @ignore */
    initializer: function () {
        return function initialize (paras) {
            var me = this;
            if(this.meta.isAbstract) {
                var name = this.meta.className();
                throw ""+name+" is an abstract class and may not instantiated."
            }
            var attributes = this.meta.getAttributes();
            for(var i in attributes) {
                var attr = attributes[i];
                attr.doInitialization(me, paras);
            }
        }
    },
    
    dieIfString: function (thing) {
        if(Joose.S.isString(thing)) {
            throw new TypeError("Parameter must not be a string.")
        }
    },
    
    addRole: function (roleClass) {
        this.dieIfString(roleClass);
        if(roleClass.meta.apply(this.getClassObject())) {
            this.roles.push(roleClass);
            this.myRoles.push(roleClass);
        }
    },
    
    getClassObject: function () {
        return this.c
    },
    
    classNameToClassObject: function (className) {
        var top    = joose.top;
        var parts  = className.split(".");
        var object = top;
        for(var i = 0; i < parts.length; i++) {
            var part = parts[i];
            object   = object[part];
            if(!object) {
                throw "Unable to find class "+className
            }
        }
        return object
    },
    
    addNonJooseSuperClass: function (name, object) {
        
        var pseudoMeta     = new Joose.MetaClassBootstrap();
        pseudoMeta.builder = Joose.MetaClassBootstrap;
        var pseudoClass    = pseudoMeta.createClass(name)
        
        Joose.O.each(object, function(value, name) {
            if(typeof(value) == "function") {
                pseudoClass.meta.addMethod(name, value)
            } else {
                pseudoClass.meta.addAttribute(name, {init: value})
            }
        })
        
        this.addSuperClass(pseudoClass);
    },
    
    addSuperClass:    function (classObject) {
        this.dieIfString(classObject);
        var me    = this;
        
        //this._fixMetaclassIncompatability(classObject)
        
        // Methods
        var names = classObject.meta.getMethodNames();
        for(var i = 0; i < names.length; i++) {
            var name = names[i]
            
            var m = classObject.meta.getMethodObject(name)
            if(m) {
                var method = m.copy();
                method.setIsFromSuperClass(true);
                me.addMethodObject(method)
            }
            m = classObject.meta.getClassMethodObject(name)
            if(m) {
                var method = m.copy();
                method.setIsFromSuperClass(true);
                me.addMethodObject(method)
            }
        } 
        
        // Attributes
        Joose.O.each(classObject.meta.attributes, function (attr, name) {
            me.addAttribute(name, attr.getProps())
        })
        
        // Roles
        var roles = classObject.meta.roles
        for(var i = 0; i < roles.length; i++) {
            var role = roles[i]
            me.roles.push(role)
        }
        
        this.parentClasses.unshift(classObject)
    },
    
    _fixMetaclassIncompatability: function (superClass) {
        
        var superMeta     = superClass.meta;
        var superMetaName = superMeta.meta.className();
        
        if(
          superMetaName == "Joose.Class"     ||
          superMetaName == "Joose.MetaClass" || 
          superMetaName == "Joose.MetaClassBootstrap") {
            return
        }
        
        // we are compatible
        if(this.meta.meta.isa(superMeta)) {
            return
        }
        
        // fix this into becoming a superMeta
        var patched = superMeta.meta.instantiate(this);
        
        for(var i in patched) {
            this[i] = patched[i]
        }
    },
    
    isa:            function (classObject) {
        this.dieIfString(classObject);
        var name = classObject.meta.className()
        // Same type
        if(this.className() == name) {
            return true
        }
        // Look up into parent classes
        for(var i = 0; i < this.parentClasses.length; i++) {
            var parent = this.parentClasses[i].meta
            if(parent.className() == name) {
                return true
            }
            if(parent.isa(classObject)) {
                return true
            }
        }
        return false
    },
    
    wrapMethod:  function (name, wrappingStyle, func, notPresentCB) {
        
        var orig = this.getMethodObject(name);
        if(orig) {
            this.addMethodObject( orig[wrappingStyle](func) )
        } else {
            if(notPresentCB) {
                notPresentCB()
            } else {
                throw new Error("Unable to apply "+wrappingStyle+" method modifier because method "+name+" does not exist");
            }
        }
    },
    
    dispatch:        function (name) {
        return this.getMethodObject(name).asFunction()
    },
    
    hasMethod:         function (name) {
        return this.methods[name] != null || this.classMethods[name] != null
    },
    
    addMethod:         function (name, func, props) {
        var m = new Joose.Method(name, func, props);
        
        this.addMethodObject(m)
    },
    
    addClassMethod:         function (name, func, props) {
        var m = new Joose.ClassMethod(name, func, props);
        
        this.addMethodObject(m)
    },
    
    addMethodObject:         function (method) {
        var m              = method;
        var name           = m.getName();
        
        if(!this.methods[name] && !this.classMethods[name]) {
            this.methodNames.push(name);
        }
        if(m.isClassMethod()) {
            this.classMethods[name] = m;
        } else {
            this.methods[name] = m;
        }
        
        method.addToClass(this.c)
    },
    
    attributeMetaclass: function () {
        return Joose.Attribute
    },
    
    addAttribute:     function (name, props) {
        
        var metaclass = this.attributeMetaclass();
        
        if(props && props.metaclass) {
            metaclass = props.metaclass
        }
        
        var at = new metaclass(name, props);
        
        at.apply(this.c)
    },
    
    getAttributes: function () {
        return this.attributes
    },
    
    getAttribute: function (name) {
        return this.attributes[name]
    },
    
    setAttribute: function (name, attributeObject) {
        return this.attributes[name] = attributeObject
    },
    
    getMethodObject: function (name) {
        return this.methods[name]
    },
    
    getClassMethodObject: function (name) {
        return this.classMethods[name]
    },
    
    getAttributeNames: function () {
        return this.attributeNames;
    },
    
    getInstanceMethods: function () {
        var a = [];
        Joose.O.each(this.methods, function (m) {
            a.push(m)
        })
        return a
    },
    
    getClassMethods: function () {
        var a = [];
        Joose.O.each(this.classMethods, function (m) {
            a.push(m)
        })
        return a
    },

    getSuperClasses:    function () {
        return this.parentClasses;
    },
    
    getSuperClass:    function () {
        return this.parentClasses[0];
    },
    
    getRoles:    function () {
        return this.roles;
    },
    
    getMethodNames:    function () {
        return this.methodNames;
    },
    
    makeAnonSubclass: function () {
        var c    = this.createClass(this.className()+"__anon__"+joose.anonymouseClassCounter++);
        c.meta.addSuperClass(this.getClassObject());
        
        return c;
    },
    
    addDetacher: function () {
        this.addMethod("detach", function detach () {
            var meta = this.meta;
            
            if(meta.isDetached) {
                return // no reason to do it again
            } 
            
            var c    = meta.makeAnonSubclass()
            
            c.meta.isDetached = true;
            
            // appy the role to the anonymous class
            // swap meta class of object with new instance
            this.meta      = c.meta;
            // swap __proto__ chain of object to its new class
            // unfortunately this is not available in IE :(
            // object.__proto__ = c.prototype
 
            this.constructor = c;
            
            var proto;
            
            // Workaround for IE and opera to enable prototype extention via the meta class (by making them identical :)
            // This however makes Role.unapply impossible
            if(!this.__proto__) {
                proto = this
            } else {
                proto   = {};
                Joose.copyObject(this, proto)
            }
            
            
            c.prototype    = proto;
            this.__proto__ = c.prototype
            return
        })
    },
    
    /**
     * Throws an exception if the class does not implement all methods required by it's roles
     * @function
     * @name validateClass
     * @memberof Joose.Class
     */    
    validateClass: function () {
        var c  = this.getClassObject();
        var me = this;
        var throwException = true;
        Joose.A.each(this.roles, function(role) {
              role.meta.isImplementedBy(c, throwException)
        })
    },
    
            /**
     * Returns true if the class implements the method 
     * @function
     * @name can
     * @param {string} methodName The method
     * @memberof Joose.Class
     */    
    can: function (methodName) {
        var method = this.methods[methodName];
        if(!method) {
            return false
        }
        return true
    },
    
    classCan: function (methodName) {
        var method = this.classMethods[methodName];
        if(!method) {
            return false
        }
        return true
    },
    
    
    /**
     * Returns true if the class implements a Role
     * @function
     * @name does
     * @param {Joose.Class} methodName The class object
     * @memberof Joose.Class
     */    
    does: function (roleObject) {
        
        for(var i = 0; i < this.roles.length; i++) {
            if(roleObject === this.roles[i]) {
                return true
            }
        }
        
        // dive into roles to find roles implemented by my roles
        for(var i = 0; i < this.roles.length; i++) {
            if(this.roles[i].meta.does(roleObject)) {
                return true
            }
        }
        
        return false
        // return classObject.meta.implementsMyMethods(this.getClassObject())
    },
    
    /**
     * Returns true if the given class implements all methods of the class 
     * @function
     * @name does
     * @param {Joose.Class} methodName The class object
     * @memberof Joose.Class
     */    
    implementsMyMethods: function (classObject) {
        var complete = true
        // FIXME buggy if class methods are involved. Should roles have class methods?
        Joose.A.each(this.getMethodNames(), function (value) {
            var found = classObject.meta.can(value)
            if(!found) {
                complete = false
            }
        })
        return complete
    },
    
    // Class builders:

    /**
     * Tells a role that the method name must be implemented by all classes that implement the role
     * @function
     * @param methodName {string} Name of the required method name
     * @name requires
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handleProprequires:    function (methodName) {
        var me = this;
        if(!this.meta.isa(Joose.Role)) {
            throw("Keyword 'requires' only available classes with a meta class of type Joose.Role")
        }
        if(methodName instanceof Array) {
            Joose.A.each(methodName, function (name) {
                me.addRequirement(name)
            })
        } else {
            me.addRequirement(methodName)
        }
    },
    
    handlePropisAbstract: function (bool) {
        this.isAbstract = bool
    },
    
    
    /**
     * Class builder method
     * Defines the super class of the class
     * @function
     * @param classObject {Joose.Class} The super class
     * @name isa
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropisa:    function (classObject) {
        this.addSuperClass(classObject)
    },
    /**
     * Class builder method
     * Defines a role for the class
     * @function
     * @param classObject {Joose.Role} The role
     * @name does
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropdoes:    function (role) {
        var me = this;
        if(role instanceof Array) {
            Joose.A.each(role, function (aRole) {
                me.addRole(aRole)
            })
        } else {
            me.addRole(role)
        }
        
    },
    
    /**
     * Class builder method
     * Defines attributes for the class
     * @function
     * @param classObject {object} Maps attribute names to properties (See Joose.Attribute)
     * @name has
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handleProphas:    function (map) {
        var me = this;
        if(typeof map == "string") {
            var name  = arguments[0];
            var props = arguments[1];
            me.addAttribute(name, props)
        } else { // name is a map
            Joose.O.each(map, function (props, name) {
                me.addAttribute(name, props)
            })
        }
    },
    
    /**
     * @ignore
     */    
    handlePropmethod: function (name, func, props) {
        this.addMethod(name, func, props)
    },
    
    /**
     * Class builder method
     * Defines methods for the class
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name methods
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropmethods: function (map) {
        var me = this
        Joose.O.each(map, function (func, name) {
            me.addMethod(name, func)
        })
    },
    
    /**
     * Class builder method
     * Defines class methods for the class
     * @function
     * @param classObject {object} Maps class method names to function bodies
     * @name classMethods
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropclassMethods: function (map) {
        var me = this;
        Joose.O.each(map, function (func, name2) {
            me.addMethodObject(new Joose.ClassMethod(name2, func))
        })
    },
    
    /**
     * Class builder method
     * Defines workers for the class (The class must have the meta class Joose.Gears)
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name workers
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropworkers: function (map) {
        var me = this;
        Joose.O.each(map, function (func, name) {
            me.addWorker(name, func)
        })
    },
    
    /**
     * Class builder method
     * Defines before method modifieres for the class.
     * The defined method modifiers will be called before the method of the super class.
     * The return value of the method modifier will be ignored
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name before
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropbefore: function(map) {
        var me = this
        Joose.O.each(map, function (func, name) {
            me.wrapMethod(name, "before", func);
        }) 
    },
    
    /**
     * Class builder method
     * Defines after method modifieres for the class.
     * The defined method modifiers will be called after the method of the super class.
     * The return value of the method modifier will be ignored
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name after
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropafter: function(map) {
        var me = this
        Joose.O.each(map, function (func, name) {
            me.wrapMethod(name, "after", func);
        }) 
    },
    
    /**
     * Class builder method
     * Defines around method modifieres for the class.
     * The defined method modifiers will be called instead of the method of the super class.
     * The orginial function is passed as an initial parameter to the new function
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name around
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handleProparound: function(map) {
        var me = this
        Joose.O.each(map, function (func, name) {
            me.wrapMethod(name, "around", func);
        }) 
    },
    
    /**
     * Class builder method
     * Defines override method modifieres for the class.
     * The defined method modifiers will be called instead the method of the super class.
     * You can call the method of the super class by calling this.SUPER(para1, para2)
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name override
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropoverride: function(map) {
        var me = this
        Joose.O.each(map, function (func, name) {
            me.wrapMethod(name, "override", func);
        }) 
    },
    
    /**
     * Class builder method
     * Defines augment method modifieres for the class.
     * These method modifiers will be called in "most super first" order
     * The methods may call this.INNER() to call the augement method in it's sup class.
     * @function
     * @param classObject {object} Maps method names to function bodies
     * @name augment
     * @memberof Joose.Builder
     */    
    /** @ignore */
    handlePropaugment: function(map) {
        var me = this
        Joose.O.each(map, function (func, name) {
            me.wrapMethod(name, "augment", func, function () {
                me.addMethod(name, func)
            });
        }) 
    },
    
    /**
     * @ignore
     */    
    handlePropdecorates: function(map) {
        var me = this
        Joose.O.each(map, function (classObject, attributeName) {
            me.decorate(classObject, attributeName)
        }) 
    }
};

// See http://code.google.com/p/joose-js/wiki/JooseAttribute
Joose.Attribute = function (name, props) {
    this.initialize(name, props)
}

Joose.Attribute.prototype = {
    
    _name:  null,
    _props: null,
    
    getName:    function () { return this._name },
    getProps:    function () { return this._props },
    
    initialize: function (name, props) {
        this._name  = name;
        this.setProps(props);
    },
    
    setProps: function (props) {
        if(props) {
            this._props = props
        } else {
            this._props = {};
        }
    },
    
    getIsa: function () {
        var props = this.getProps();
        if(props.isa) {
            if(!props.isa.meta) {
                return props.isa()
            }
            return props.isa
        }
        return
    },
    
    addSetter: function (classObject) {
        var meta  = classObject.meta;
        var name  = this.getName();
        var props = this.getProps();
        
        var isa   = this.getIsa();

        var func;
        if(isa) {
            func = function setterWithIsaCheck (value) {
                if(!value || !value.meta) {
                    throw "The attribute "+name+" only accepts values that have a meta object."
                }
                // TODO add does
                if(!value.meta.isa(isa)) {
                    throw "The attribute "+name+" only accepts values that are objects of type "+isa.meta.className()+"."
                }
                this[name] = value
                return this;
            }
        } else {
            func = function setter (value) {
                this[name] = value
                return this;
            }
        }
        meta.addMethod(this.setterName(), func);
    },
    
    
    addGetter: function (classObject) {
        var meta  = classObject.meta;
        var name  = this.getName();
        var props = this.getProps();
        
        var func  = function getter () {
            return this[name]
        }
        
        var init  = props.init;
        
        if(props.lazy) {
            func = function lazyGetter () {
                var val = this[name];
                if(typeof val == "function" && val === init) {
                    this[name] = val.apply(this)
                }
                return this[name]
            }
        }
        
        meta.addMethod(this.getterName(), func);
    },
    
    initializerName: function () {
        return this.toPublicName()
    },
    
    getterName: function () {
        if(this.__getterNameCache) { // Cache the getterName (very busy function)
            return this.__getterNameCache
        }
        this.__getterNameCache = "get"+Joose.S.uppercaseFirst(this.toPublicName())
        return this.__getterNameCache;
    },
    
    setterName: function () {
        if(this.__setterNameCache) { // Cache the setterName (very busy function)
            return this.__setterNameCache
        }
        this.__setterNameCache = "set"+Joose.S.uppercaseFirst(this.toPublicName())
        return this.__setterNameCache;
    },
    
    isPrivate: function () {
        return this.getName().charAt(0) == "_"
    },
    
    toPublicName: function () {
        
        if(this.__publicNameCache) { // Cache the publicName (very busy function)
            return this.__publicNameCache
        }
        
        var name = this.getName();
        if(this.isPrivate()) {
            this.__publicNameCache = name.substr(1)
            return this.__publicNameCache;
        }
        this.__publicNameCache = name
        return this.__publicNameCache
    },
    
    handleIs: function (classObject) {
        var meta  = classObject.meta;
        var name  = this.getName();
        var props = this.getProps();
        
        var is    = props.is;

        if(is == "rw" || is == "ro") {
            this.addGetter(classObject);
        }
        if(is == "rw") {
            this.addSetter(classObject)
        }
    },
    
    handleInit: function (classObject) {
        var props = this.getProps();
        var name  = this.getName();
        
        classObject.prototype[name]     = null;
        if(typeof props.init != "undefined") {
            var val = props.init;
            var type = typeof val;

            classObject.prototype[name] = val;
        }
    },
    
    handleProps: function (classObject) {
        this.handleIs(classObject);
        this.handleInit(classObject)
    },
    
    apply: function (classObject) {
        
        var meta  = classObject.meta;
        var name  = this.getName();
        
        this.handleProps(classObject)
        
        meta.attributeNames.push(name)
        
        meta.setAttribute(name, this)
        meta.attributes[name] = this;
    }
    
    
}

// See http://code.google.com/p/joose-js/wiki/JooseMethod
Joose.Method = function (name, func, props) {
    this.initialize(name, func, props)
}

Joose.Method.prototype = {
    
    _name: null,
    _body: null,
    _props: null,
    _isFromSuperClass: false,
    
    getName:    function () { return this._name },
    getBody:    function () { return this._body },
    getProps:   function () { return this._props },
    
    isFromSuperClass: function () {
        return this._isFromSuperClass
    },
    
    setIsFromSuperClass: function (bool) {
        this._isFromSuperClass = bool
    },
    
    copy: function () {
        // Hardcode class name because at this point this.meta.instantiate might not work yet
        // this is later overridden in the file Joose/Method.js
        return new Joose.Method(this.getName(), this.getBody(), this.getProps())
    },
    
    initialize: function (name, func, props) {
        this._name  = name;
        this._body  = func;
        this._props = props;
        
        func.name   = name
    
        func.meta   = this
    },
    
    isClassMethod: function () { return false },
    
    apply:    function (thisObject, args) {
        return this._body.apply(thisObject, args)
    },
    
    addToClass: function (c) {
        c.prototype[this.getName()] = this.asFunction()
    },
    
    // direct call
    asFunction:    function () {
        return this._body
    }
}
Joose.bootstrap()






    



// ##########################
// File: Joose/Builder.js
// ##########################
// Could be refactored to a Joose.Class (by manually building the class)

/**
 * Assorted tools to build a class
 * 
 * The functions Class(), Module() and joosify() are global. All other methods
 * may be used inside Class definitons like this:
 * 
 * <pre>
 * Module("com.test.me", function () {
 *   Class("MyClass", {
 *     isa: SuperClass,
 *     methods: {
 *       hello: function () { alert('world') }
 *     }
 *   })
 * })
 * </pre>
 * @constructor
 */
Joose.Builder = function () {
    /** @ignore */
    this.globalize = function () {
        Joose.O.each(Joose.Builder.Globals, function (func, name) {
            var globalName = "Joose"+name
            if(typeof joose.top[name] == "undefined") {
                joose.top[name] = func
            }
            
            joose.top[globalName] = func
        });
    }
}

/** @ignore */
Joose.Builder.Globals = {
    /**
     * Global function that creates or extends a module
     * @function
     * @param name {string} Name of the module
     * @param functionThatCreatesClassesAndRoles {function} Pass a function reference that calls Class(...) as often as you want. The created classes will be put into the module
     * @name Module
     */    
    /** @ignore */
    Module: function (name, functionThatCreatesClassesAndRoles) {
        return Joose.Module.setup(name, functionThatCreatesClassesAndRoles)
    },
    
    Role: function (name, props) {
        if(!props.meta) {
            props.meta = Joose.Role;
        }
        return Class(name, props)
    },
    
    Prototype: function (name, props) {
        if(!props.meta) {
            props.meta = Joose.Prototype;
        }
        return Class(name, props);
    },
    
    /**
     * Global function that creates a class (If the class already exists it will be extended)
     * @function
     * @param name {string} Name of the the class
     * @param props {object} Declaration if the class. The object keys are used as builder methods. The values are passed as arguments to the builder methods.
     * @name Class
     */    
    /** @ignore */
    Class:    function (name, props) {
        
        var c = null;
        
        if(name) {
            var className  = name;
            if(joose.currentModule) {
                className  = joose.currentModule.getName() + "." + name
            }
            var root       = joose.top;
            var parts      = className.split(".")
        
            for(var i = 0; i < parts.length; i++) {
                root = root[parts[i]]
            }
            c = root;
        }

        if(c == null) {
            
            var metaClass;
            
            /* Use the custom meta class if provided */
            if(props && props.meta) {
                metaClass = props.meta
                delete props.meta
            }
            /* Otherwise use the meta class of the parent class (If there is one)
             * If the parent class is Joose.Class, we don't change the meta class but use the default
             * because that Joose.Class's meta class is only needed for bootstrapping
             * purposes. */
            else if(props && props.isa && props.isa != Joose.Class) {
                metaClass = props.isa.meta.builder
                //alert(name + metaClass + props.isa.meta)
            }
            /* Default meta class is Joose.Class */
            else {
                metaClass   = Joose.Class;
            }    
            
            var aClass      = new metaClass();
            
            aClass.builder  = metaClass;

            var c           = aClass.createClass(name, null, joose.currentModule)
            
            c.meta.builder  = metaClass
            
            var className   = c.meta.className()
            
            if(name && className) {
                var root = joose.top;
                var n = new String(className);
                var parts = n.split(".");
                for(var i = 0; i < parts.length - 1; i++) {
                    if(root[parts[i]] == null) {
                        root[parts[i]] = {};
                    }
                    root = root[parts[i]];
                }
                root[parts[parts.length - 1]] = c
            }
            
        }
        
        c.meta.initializeFromProps(props)
        
        return c
    },
    
    Type: function (name, props) {
        var t = Joose.TypeConstraint.newFromTypeBuilder(name, props);
        
        var m = joose.currentModule
        
        if(!m) {
            Module("TYPE")
            m = TYPE.meta;
        }
        
        m.addElement(t)
        m.getContainer()[name] = t;
        return t
    },
    
    /**
     * Global function to turn a regular JavaScript constructor into a Joose.Class
     * @function
     * @param name {string} Name of the class
     * @param props {function} The constructor
     * @name joosify
     */    
    /** @ignore */
    joosify: function (standardClassName, standardClassObject) {
        var c         = standardClassObject;
        var metaClass = new Joose.Class();
        metaClass.builder = Joose.Class;
        
        c.toString = function () { return this.meta.className() }
        c             = metaClass.createClass(standardClassName, c)
    
        var meta = c.meta;
    
        for(var name in standardClassObject.prototype) {
            if(name == "meta") {
                continue
            }
            var value = standardClassObject.prototype[name]
            if(typeof(value) == "function") {
                meta.addMethod(name, value)
            } else {
                var props = {};
                if(typeof(value) != "undefined") {
                    props.init = value
                }
                meta.addAttribute(name, props)
            }
        }
        
        return c
    },
    
    /** @ignore */
    rw: "rw",
    /** @ignore */
    ro: "ro"
};

joose.init();
// ##########################
// File: Joose/Class.js
// ##########################


Joose.bootstrap2();
// ##########################
// File: Joose/Method.js
// ##########################
/*
 * A class for methods
 * Originally defined in Joose.js
 * 
 * See http://code.google.com/p/joose-js/wiki/JooseMethod
 */

Class("Joose.Method", {
    methods: {
        
        copy: function () {
            return this.meta.instantiate(this.getName(), this.getBody(), this.getProps())
        },
        
        // creates a new method object with the same name
        _makeWrapped: function (func) {
            return this.meta.instantiate(this.getName(), func); // Should there be , this.getProps() ???
        },
        
        around: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function aroundWrapper () {
                var me = this;
                var bound = function () { return orig.apply(me, arguments) }
                return func.apply(this, Joose.A.concat([bound], arguments))
            })            
        },
        before: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function beforeWrapper () {
                func.apply(this, arguments)
                return orig.apply(this, arguments);
            })        
        },
        after: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function afterWrapper () {
                var ret = orig.apply(this, arguments);
                func.apply(this, arguments);
                return ret
            })
        },
        
        override: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function overrideWrapper () {
                var me      = this;
                var bound   = function () { return orig.apply(me, arguments) }
                var before  = this.SUPER;
                this.SUPER  = bound;
                var ret     = func.apply(this, arguments);
                this.SUPER  = before;
                return ret
            })            
        },
        
        augment: function (func) {
            var orig = this.getBody();
            orig.source = orig.toString();
            return this._makeWrapped(function augmentWrapper () {
                var exe       = orig;
                var me        = this;
                var inner     = func
                inner.source  = inner.toString();
                if(!this.__INNER_STACK__) {
                    this.__INNER_STACK__ = [];
                };
                this.__INNER_STACK__.push(inner)
                var before    = this.INNER;
                this.INNER    = function () {return  me.__INNER_STACK__.pop().apply(me, arguments) };
                var ret       = orig.apply(this, arguments);
                this.INNER    = before;
                return ret
            })
        }
    }
})
// ##########################
// File: Joose/ClassMethod.js
// ##########################
Class("Joose.ClassMethod", {
    isa: Joose.Method,
    methods: {
        isClassMethod: function () { return true },
        addToClass: function (c) {
            c[this.getName()] = this.asFunction()
        },
        
        copy: function () {
            return new Joose.ClassMethod(this.getName(), this.getBody(), this.getProps())
        }
    }
})
// ##########################
// File: Joose/Method.js
// ##########################
/*
 * A class for methods
 * Originally defined in Joose.js
 * 
 * See http://code.google.com/p/joose-js/wiki/JooseMethod
 */

Class("Joose.Method", {
    methods: {
        
        copy: function () {
            return this.meta.instantiate(this.getName(), this.getBody(), this.getProps())
        },
        
        // creates a new method object with the same name
        _makeWrapped: function (func) {
            return this.meta.instantiate(this.getName(), func); // Should there be , this.getProps() ???
        },
        
        around: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function aroundWrapper () {
                var me = this;
                var bound = function () { return orig.apply(me, arguments) }
                return func.apply(this, Joose.A.concat([bound], arguments))
            })            
        },
        before: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function beforeWrapper () {
                func.apply(this, arguments)
                return orig.apply(this, arguments);
            })        
        },
        after: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function afterWrapper () {
                var ret = orig.apply(this, arguments);
                func.apply(this, arguments);
                return ret
            })
        },
        
        override: function (func) {
            var orig = this.getBody();
            return this._makeWrapped(function overrideWrapper () {
                var me      = this;
                var bound   = function () { return orig.apply(me, arguments) }
                var before  = this.SUPER;
                this.SUPER  = bound;
                var ret     = func.apply(this, arguments);
                this.SUPER  = before;
                return ret
            })            
        },
        
        augment: function (func) {
            var orig = this.getBody();
            orig.source = orig.toString();
            return this._makeWrapped(function augmentWrapper () {
                var exe       = orig;
                var me        = this;
                var inner     = func
                inner.source  = inner.toString();
                if(!this.__INNER_STACK__) {
                    this.__INNER_STACK__ = [];
                };
                this.__INNER_STACK__.push(inner)
                var before    = this.INNER;
                this.INNER    = function () {return  me.__INNER_STACK__.pop().apply(me, arguments) };
                var ret       = orig.apply(this, arguments);
                this.INNER    = before;
                return ret
            })
        }
    }
})
// ##########################
// File: Joose/Attribute.js
// ##########################
/*
 * This handles the following attribute properties
 *  * init with function value in non-lazy initialization
 *  * required attributes in initializaion
 *  * handles for auto-decoration
 *  * predicate for attribute availability checks
 * 
 * 
 * See http://code.google.com/p/joose-js/wiki/JooseAttribute
 */


Class("Joose.Attribute", {
    after: {
        handleProps: function (classObject) {
            this.handleHandles(classObject);
            this.handlePredicate(classObject);
        }
    },
    methods: {
        
        isPersistent: function () {
            var props = this.getProps()
            if(props.persistent == false) {
                return false
            }
            return true
        },
        
        doInitialization: function (object, paras) {
            var  name  = this.initializerName();
            var _name  = this.getName();
            var value;
            var isSet  = false;
            if(typeof paras != "undefined" && typeof paras[name] != "undefined") {
                value  = paras[name];
                isSet  = true;
            } else {
                var props = this.getProps();
                
                if(props.required) {
                    throw "Required initialization parameter missing: "+name + "(While initializing "+object+")"
                }
                
                var init  = props.init;
                if(typeof init == "function" && !props.lazy) {
                    // if init is not a function, we have put it in the prototype, so it is already here
                    value = init.call(object)
                    isSet = true
                }
            }
            if(isSet) {
                var setterName = this.setterName();
                if(object.meta.can(setterName)) { // use setter if available
                    object[setterName](value)
                } else { // direct attribute access
                    object[_name] = value
                }
            }
        },
        
        handleHandles: function (classObject) {
            var meta  = classObject.meta;
            var name  = this.getName();
            var props = this.getProps();
            
            var handles = props.handles;
            var isa     = props.isa
            
            if(handles) {
                if(handles == "*") {
                    if(!isa) {
                        throw "I need an isa property in order to handle a class"
                    }
                    
                    // receives the name and should return a closure
                    var optionalHandlerMaker = props.handleWith;
                    
                    meta.decorate(isa, name, optionalHandlerMaker)
                } 
                else {
                    throw "Unsupported value for handles: "+handles
                }
                
            }
        },
        
        handlePredicate: function (classObject) {
            var meta  = classObject.meta;
            var name  = this.getName();
            var props = this.getProps();
            
            var predicate = props.predicate;
            
            var getter    = this.getterName();
            
            if(predicate) {
                meta.addMethod(predicate, function () {
                    var val = this[getter]();
                    return val ? true : false
                })
            }
        }
    }
})
// ##########################
// File: Joose/Role.js
// ##########################

/*
 * An Implementation of Traits
 * see http://www.iam.unibe.ch/~scg/cgi-bin/scgbib.cgi?query=nathanael+traits+composable+units+ecoop
 * 
 * Current Composition rules:
 * - At compile time we override existing (at the time of rule application) methods
 * - At runtime we dont
 */
Class("Joose.Role", {
    isa: Joose.Class,
    has: ["requiresMethodNames", "methodModifiers"],
    methods: {
        
        wrapMethod: function () {
            this.methodModifiers.push(arguments)
            var test = this.methodModifiers
        },
        
        requiresMethod: function (methodName) {
            var bool = false;
            Joose.A.each(this.requiresMethodNames, function (name) {
                if(methodName == name) {
                    bool = true
                }
            })
            
            return bool
        },
        
        addInitializer: Joose.emptyFunction,
        
        defaultClassFunctionBody: function () {
            var f = function () {
                throw new Error("Roles may not be instantiated.")
            };
            joose.addToString(f, function () { return this.meta.className() })
            return f
        },
        
        addSuperClass: function () {
            throw new Error("Roles may not inherit from a super class.")
        },
        
        initialize: function () {
            this._name               = "Joose.Role"
            this.requiresMethodNames = [];
            this.methodModifiers     = [];
        },
        
        addRequirement: function (methodName) {
            this.requiresMethodNames.push(methodName)
        },
        
        unapply: function (object) {
            if(!joose.isInstance(object)) {
                throw new Error("You way only remove roles from instances.")
            }
            if(!object.meta.isDetached) {
                throw new Error("You may only remove roles that were applied at runtime")
            }
            
            var role  = this.getClassObject()
            
            var roles = object.meta.myRoles; // myRoles!!!
            var found = false;
            var otherRoles = [];
            for(var i = 0; i < roles.length; i++) {
                if(roles[i] === role) {
                    found = true;
                } else {
                    otherRoles.push(roles[i])
                }
            }
            if(!found) {
                throw new Error("The role "+this.className()+" was not applied to the object at runtime")
            }
            
            var superClass     = object.meta.getSuperClass();
            var c              = superClass.meta.makeAnonSubclass();
            
            
            // rebless object
            /*if(typeof(object.__proto__) != "undefined") {
                object.__proto__ = c.prototype                    
            } else {   // Workaround for IE: 
            */
            
            var test = new c()
            
            // add all roles except the one that we are removing
            for(var i = 0; i < otherRoles.length; i++) {
                var role = otherRoles[i]
                c.meta.addRole(role)
            }
            
            c.prototype        = test
            
            object.meta        = c.meta;
            object.constructor = c;
            object.__proto__   = test
        },
        
        addMethodToClass: function (method, classObject) {
            var name = method.getName()
            var cur;
            if(method.isClassMethod()) {
                cur = classObject.meta.getClassMethodObject(name)
            } else {
                cur = classObject.meta. getMethodObject(name)
            }
            if(!cur || cur.isFromSuperClass()) {
                classObject.meta.addMethodObject(method)
            }
        },
    
        apply: function (object) {
            
            // XXX ask in #moose whether this is correct
            // A Role should not be applied twice
            if(object.meta.does(this.getClassObject())) {
                return false
            }
            
            if(joose.isInstance(object)) {
                // Create an anonymous subclass ob object's class
                
                object.detach();
                object.meta.addRole(this.getClassObject());
            } else {
                // object is actually a class
                var me    = this;
                var names = this.getMethodNames();
        
                //alert("Super"+me.name + " -> "+classObject.meta.name +"->" + names)
        
                Joose.A.each(names, function (name) {
                    
                    var m = me.getMethodObject(name)
                    if(m) {
                        me.addMethodToClass(m, object)
                    }
                    
                    m = me.getClassMethodObject(name)
                    if(m) {
                        me.addMethodToClass(m, object)
                    }
                })
                
                Joose.A.each(this.methodModifiers, function (paras) {
                    object.meta.wrapMethod.apply(object.meta, paras)
                })
            }
            return true
        },
    
        hasRequiredMethods: function (classObject, throwException) {
            var me       = this
            var complete = true
            Joose.A.each(this.requiresMethodNames, function (value) {
                var found = classObject.meta.can(value)
                if(!found) {
                    if(throwException) {
                         throw("Class "+classObject.meta.className()+" does not fully implement the role "+me.meta.className()+". The method is "+value+" missing.")
                    }
                    complete = false
                    return
                }
            })
            return complete
        },
    
        isImplementedBy: function (classObject, throwException) {
        
            var complete = this.hasRequiredMethods(classObject, throwException);
            if(complete) {
                complete = this.implementsMyMethods(classObject);
            }
            return complete
        }
    }
})

Joose.Role.anonymousClassCounter = 0;
// ##########################
// File: Joose/SimpleRequest.js
// ##########################
/**
 * Class to perform simple synchronous AJAX Requests used for component loading.
 * @name Joose.SimpleRequest
 * @class
 */
Class("Joose.SimpleRequest", {

    has: {_req: {}},
    methods: {
        initialize: function () {
            if (isDefined(typeof window.XMLHttpRequest)) {
                this._req = new XMLHttpRequest();
            } else {
                this._req = new ActiveXObject("Microsoft.XMLHTTP");
            }
        },
        /**
         * Fetches text from an URL
         * @name getText
         * @param {string} url The URL
         * @function
         * @memberof Joose.SimpleRequest
         */
        getText: function (url) {
            this._req.open("GET", url, false);
            try {
                this._req.send(null);
                if (this._req.status == 200 || this._req.status == 0)
                    return this._req.responseText;
            } catch (e) {
                throw("File not found: " + url);
                return null;
            };

            throw("File not found: " + url);
            return null;
        }
    }
})
// ##########################
// File: Joose/Gears.js
// ##########################
/**
 * Joose.Gears is a meta class for classes that want to delegate work to gears workers
 * @name Joose.Gears
 * @extends Joose.Class
 * @constructor
 */
Class("Joose.Gears", {
    isa: Joose.Class,
    has: {
        wp: {  },
        calls: { init: {} },
        callIndex: { init: 0 }
    },
    
    methods: {
        initialize: function () {
            JooseGearsInitializeGears() 
            if(this.canGears()) {
                this.wp = google.gears.factory.create('beta.workerpool');
                var me = this;
                this.wp.onmessage = function (a,b,message) {
                    me.handleGearsMessage(message)
                }
            }
        },
        handleGearsMessage: function (message) {
            var paras  = message.body
            var cbName = paras.to;
            var ret    = paras.ret;
            var object = this.calls[paras.index];
            if(object.meta.can(cbName)) {
                object[cbName].call(object, ret)
            }
            //delete this.calls[paras.index]
        },
        
        canGears: function () {
            return isDefined(typeof window.google) && window.google.gears && window.google.gears.factory
        },
        
        /**
         * Adds a worker to the class
         * @function
         * @name addWorker
         * @param {string} Name of the worker
         * @param {function} Function body of the worker
         * @param {props} Optional properties for the created method (ignored)
         * @memberof Joose.Gears
         */    
        addWorker:         function (name, func, props) {
            
            var cbName  = "on"+Joose.S.uppercaseFirst(name)

            var ajaxRequestFunc = this.meta.getClassObject().ajaxRequest;
            
            // No gears, then work inline
            if(!this.canGears()) {
                var wrapped = function () {
                    var me = this;
                    var object = {
                        sendReturn:     function (ret, cbName) { if(me.meta.can(cbName)) me[cbName].call(me, ret) },
                        clientHasGears: function () { return false },
                        ajaxRequest:    ajaxRequestFunc
                    };
                    var ret = func.apply(object, arguments);
                    object.sendReturn(ret, cbName)
                }
                this.addMethod(name, wrapped, props)
                return
            }
            
            // OK, we have gears support
            
            var jsonUrl = this.can("jsonURL") ? this.c.jsonURL() : "json2.js";
            
            var json    = new Joose.SimpleRequest().getText(jsonUrl)
                
            var source  = 
              "var timer = google.gears.factory.create('beta.timer');\n"+ // always provide timer
              "function aClass () {}; aClass.prototype."+name+" = "+func.toString()+"\n\n"+
              "aClass.prototype.clientHasGears = function () { return true }\n"+
              "aClass.prototype.ajaxRequest = "+ajaxRequestFunc.toString()+"\n\n"+
              "var wp = google.gears.workerPool;\n" +
              "wp.onmessage = function (a,b,message) {\n"+
              
              "var paras = message.body;\n"+
              
              "var o = new aClass();\n"+
              
              "o.sendReturn = function (ret, cbName) { wp.sendMessage({ ret: ret, to: cbName, index: paras.index }, message.sender) } \n"+ 
              
              "var ret = o."+name+".apply(o, paras.args); if(!ret) ret = null; \n"+
              "o.sendReturn(ret, paras.cbName);"+
              "\n}\n\n";
              
        
            
            source += json
            
            var wp      = this.wp;
            
            var childId = wp.createWorker(source)
            
            var me      = this
                
            var wrapped = function () {
                var args = [];
                for(var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i])
                }
                var message = { args: args, cbName: cbName, index: me.callIndex };
                wp.sendMessage(message, childId);
                me.calls[me.callIndex] = this
                me.callIndex++
                
            }
            this.addMethod(name, wrapped, props)

        }
    },
    
    classMethods: {
        // builds an environment for non gears platform where the regular window looks more like a gears worker
        // APIs implemented: Timer
        setupGearsCompat: function () {
            // setup gears timer api
            //window.timer = {
            timer = {
                setTimeout:    function (func, time) { return window.setTimeout(func, time) },
                setInterval:   function (func, time) { return window.setInterval(func, time) },
                clearTimeout:  function (timer) { return window.clearTimeout(timer) },
                clearInterval: function (timer) { return window.clearInterval(timer) }
            };
        },
        
        clientHasGears: function () { //  XXX code dup with instance method
            return isDefined(typeof window.google) && window.google.gears && window.google.gears.factory
        },
        
        // a simple AJAX request that uses gears if available
        ajaxRequest: function (method, url, data, callback, errorCallback) {
        
            var request
            if(this.clientHasGears()) {
                request = google.gears.factory.create('beta.httprequest');
            } else {
                request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
            }
            var dataString    = ""
            if(data) {
                for(var i in data) {
                    dataString += encodeURIComponent(i)+"="+encodeURIComponent(data[i])+"&"
                }
            }
            var theUrl = url;
            if(data && method == "GET") {
                theUrl += "?"+dataString
            }
            request.open(method, theUrl, true);
                
            request.onreadystatechange = function onreadystatechange () {
                if (request.readyState == 4) {
                    if(request.status >= 200 && request.status < 400) {
                        var res = request.responseText;
                        callback(res)
                    } else {
                        if(errorCallback) {
                            return errorCallback(request)
                        } else {
                            throw new Error("Error fetching url "+theUrl+". Response code: " + request.status + " Response text: "+request.responseText)
                        }
                    }
                }
            };
            if(data && method == "POST") {
                // FIXME determine page encoding instead of always using UTF8
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); 
                request.send(dataString)
            } else {
                dataString = ""
                request.send(dataString);
            }
        }
    }
})

// Copyright 2007, Google Inc.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//  3. Neither the name of Google Inc. nor the names of its contributors may be
//     used to endorse or promote products derived from this software without
//     specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Sets up google.gears.*, which is *the only* supported way to access Gears.
//
// Circumvent this file at your own risk!
//
// In the future, Gears may automatically define google.gears.* without this
// file. Gears may use these objects to transparently fix bugs and compatibility
// issues. Applications that use the code below will continue to work seamlessly
// when that happens.

// Sorry Google for modifying this :) 
function JooseGearsInitializeGears() {
  // We are already defined. Hooray!
  if (isDefined(typeof window.google) && google.gears) {
    return;
  }

  var factory = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
    factory = new GearsFactory();
  } else {
    // IE
    try {
      factory = new ActiveXObject('Gears.Factory');
      // privateSetGlobalObject is only required and supported on WinCE.
      if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
        factory.privateSetGlobalObject(this);
      }
    } catch (e) {
      // Safari
      if (navigator.mimeTypes["application/x-googlegears"]) {
        factory = document.createElement("object");
        factory.style.display = "none";
        factory.width = 0;
        factory.height = 0;
        factory.type = "application/x-googlegears";
        document.documentElement.appendChild(factory);
      }
    }
  }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!factory) {
    return;
  }

  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!isDefined(typeof window.google)) {
    google = {};
  }

  if (!google.gears) {
    google.gears = {factory: factory};
  }
}



// ##########################
// File: Joose/Storage.js
// ##########################



Role("Joose.Storage", {
    
    methods: {
        // gets called by the JSON.stringify method
        toJSON: function () {
            // Evil global var TEMP_SEEN. See Joose.Storage.Unpacker.patchJSON
            return this.pack(Joose.Storage.TEMP_SEEN)
        },
        
        // Generate an object identity (a unique integer for this object
        // This is cached in a property called __ID__
        // Override this in object representing values
        identity: function () {
            if(this.__ID__) {
                return this.__ID__
            } else {
                return this.__ID__ = Joose.Storage.OBJECT_COUNTER++
            }
        },
        
        pack: function (seen) {
            return this.meta.c.storageEngine().pack(this, seen)
        }
    },
    
    classMethods: {
        
        storageEngine: function () {
            return Joose.Storage.Engine
        },
        
        unpack: function (data) {
            return this.storageEngine().unpack(this, data)
        }
    }
    
})



Role("Joose.Storage.jsonpickle", {
    does: Joose.Storage,
    
    classMethods: {
        storageEngine: function () {
            return Joose.Storage.Engine.jsonpickle
        }
    }
})

Joose.Storage.OBJECT_COUNTER = 1;

// This storage engine is base on MooseX::Storage: http://search.cpan.org/~nuffin/MooseX-Storage-0.14/lib/MooseX/Storage.pm
Class("Joose.Storage.Engine", {
    
    classMethods: {
        
        pack: function (object, seen) {
            
            
            if(seen) {
                var id  = object.identity()
                var obj = seen[id];
                if(obj) {
                    return {
                        __ID__: id
                    }
                }
            }
            
            if(object.meta.can("prepareStorage")) {
                object.prepareStorage()
            }
            
            if(seen) {
                seen[object.identity()] = true
            }
            
            var o  = {
                __CLASS__: this.packedClassName(object),
                __ID__:    object.identity()
            };
            
            var attrs      = object.meta.getAttributes();
            
            Joose.O.each(attrs, function packAttr (attr, name) {
                if(attr.isPersistent()) {
                    o[name]   = object[name];
                }
            })
  
            return o
        },
        
        unpack: function (classObject, data) {
            var meta      = classObject.meta
            var me        = meta.instantiate();
            var seenClass = false;
            Joose.O.each(data, function unpack (value,name) {
                if(name == "__CLASS__") {
                    var className = Joose.Storage.Unpacker.packedClassNameToJSClassName(value)
                    if(className != me.meta.className()) {
                        throw new Error("Storage data is of wrong type "+className+". I am "+me.meta.className()+".")
                    }
                    seenClass = true
                    return
                }
                me[name] = value
            })
            if(!seenClass) {
                throw new Error("Serialized data needs to include a __CLASS__ attribute.: "+data)
            }
            
            // Unpacked id may come from another global counter and thus must be discarded
            delete me.__ID__
            
            if(me.meta.can("finishUnpack")) {
                me.finishUnpack()
            }
            
            return me
        },
        
        packedClassName: function (object) {
            if(object.meta.can("packedClassName")) {
                return object.packedClassName();
            }
            var name   = object.meta.className();
            var parts  = name.split(".");
            return parts.join("::");
        }
    }
    
})

Class("Joose.Storage.Engine.jsonpickle", {
    
    classMethods: {
        
        pack: function (object, seen) {
            
            
            if(seen) {
                var id  = object.identity()
                var obj = seen[id];
                if(obj) {
                    return {
                        objectid__: id
                    }
                }
            }
            
            if(object.meta.can("prepareStorage")) {
                object.prepareStorage()
            }
            
            if(seen) {
                seen[object.identity()] = true
            }
            
            var o  = {
                classname__:   this.packedClassName(object),
                classmodule__: this.packedModuleName(object),
                objectid__:    object.identity()
            };
            
            var attrs      = object.meta.getAttributes();
            
            Joose.O.each(attrs, function packAttr (attr, name) {
                if(attr.isPersistent()) {
                    o[name]   = object[name];
                }
            })
  
            return o
        },
        
        unpack: function (classObject, data) {
            var meta      = classObject.meta
            var me        = meta.instantiate();
            var seenClass = false;
            Joose.O.each(data, function unpack (value,name) {
                if(name == "classname__") {
                    var className = value;
                    var module    = data.classmodule__
                    if(module) {
                        className = "" + module + "." + value
                    }
                    if(className != me.meta.className()) {
                        throw new Error("Storage data is of wrong type "+className+". I am "+me.meta.className()+".")
                    }
                    seenClass = true
                    return
                }
                if(name == "classmodule__") {
                    return
                }
                me[name] = value
            })
            if(!seenClass) {
                throw new Error("Serialized data needs to include a __CLASS__ attribute.: "+data)
            }
            
            if(me.meta.can("finishUnpack")) {
                me.finishUnpack()
            }
            
            return me
        },
        
        packedClassName: function (object) {
            var name   = object.meta.className();
            var parts  = name.split(".");
            return parts.pop()
        },
        
        packedModuleName: function (object) {
            var name   = object.meta.className();
            var parts  = name.split(".");
            parts.pop();
            return parts.join(".");
        }
    }
    
})

Joose.Storage.storageEngine            = Joose.Storage.Engine
Joose.Storage.jsonpickle.storageEngine = Joose.Storage.Engine.jsonpickle
// ##########################
// File: Joose/Storage/Unpacker.js
// ##########################


Class("Joose.Storage.Unpacker", {
    classMethods: {
        unpack: function (data) {
            var name = data.__CLASS__;
            if(!name) {
                throw("Serialized data needs to include a __CLASS__ attribute.")
            }
            var jsName = this.packedClassNameToJSClassName(name)
            
            var co  = this.meta.classNameToClassObject(jsName);
            
            var obj = co.unpack(data);
            
            var id;
            if(Joose.Storage.CACHE && (id = data.__ID__)) {
                Joose.Storage.CACHE[id] = obj
            }
            
            return obj
        },
        
        // Format My::Class::Name-0.01 We ignore the version
        packedClassNameToJSClassName: function (packed) { 
            var parts  = packed.split("-");
            parts      = parts[0].split("::");
            return parts.join(".");
        },
        
        jsonParseFilter: function (key, value) {
            if(value != null && typeof value == "object") {
                if(value.__CLASS__) {
                    return Joose.Storage.Unpacker.unpack(value)
                }
                if(value.__ID__) {
                    return Joose.Storage.CACHE[value.__ID__]
                }
            }
            return value
        },
        
        patchJSON: function () {
            var orig = JSON.parse;
            var storageFilter = this.jsonParseFilter
            JSON.parse = function (s, filter) {
                Joose.Storage.CACHE = {}
                return orig(s, function JooseJSONParseFilter (key, value) {
                    var val = value;
                    if(filter) {
                        val = filter(key, value)
                    }
                    return storageFilter(key,val)
                })
            }
            
            var stringify = JSON.stringify;
            JSON.stringify = function () {
                Joose.Storage.TEMP_SEEN = {}
                return stringify.apply(JSON, arguments)
            }
        }
    }
})



Class("Joose.Storage.Unpacker.jsonpickle", {
    isa: Joose.Storage.Unpacker,
    classMethods: {
        unpack: function (data) {
            var name = data.classname__;
            if(!name) {
                throw("Serialized data needs to include a classname__ attribute.")
            }
            var jsName = this.packedClassNameToJSClassName(name, data.classmodule__)
            
            var co  = this.meta.classNameToClassObject(jsName);
            
            var obj = co.unpack(data);
            
            var id;
            if(Joose.Storage.CACHE && (id = data.objectid__)) {
                Joose.Storage.CACHE[id] = obj
            }
            
            return obj
        },
        
        // Format My::Class::Name-0.01 We ignore the version
        packedClassNameToJSClassName: function (className, moduleName) { 
            var name = "";
            if(moduleName) {
                name += moduleName + "."
            }
            name += className;
            return name
        },
        
        jsonParseFilter: function (key, value) {
            if(value != null && typeof value == "object") {
                if(value.classname__) {
                    return Joose.Storage.Unpacker.jsonpickle.unpack(value)
                }
                if(value.objectid__) {
                    return Joose.Storage.CACHE[value.objectid__]
                }
            }
            return value
        }
    }
})
// ##########################
// File: Joose/Decorator.js
// ##########################
Class("Joose.Decorator", {
    meta: Joose.Role,
    methods: {
        decorate: function (classObject, attributeName, optionalDelegatorFuncMaker) {
            var me = this;
            Joose.A.each(classObject.meta.getInstanceMethods(), function (m) {
                var name    = m.getName();
                var argName = attributeName;
                // only override non existing methods
                if(!me.can(name)) {
                    
                    var func = function () {
                        var d = this[argName];
                        return d[name].apply(d, arguments)
                    }
                    
                    if(optionalDelegatorFuncMaker) {
                        func = optionalDelegatorFuncMaker(name)
                    }
                    
                    me.addMethod(name, func);
                }
            })
        }
    }
})

Joose.Decorator.meta.apply(Joose.Class)
// ##########################
// File: Joose/Module.js
// ##########################

/*
Module("my.namespace", function () {
    Class("Test", {
        
    })
})
*/

Class("Joose.Module", {
    has: {
        _name: {
            is: "rw"
        },
        _elements: {
            is: "rw"
        },
        _container: {
            is: "rw"
        }
    },
    classMethods: {
        setup: function (name, functionThatCreatesClassesAndRoles) {
            var me      = this;
            var parts   = name.split(".");
            var object  = joose.top;
            var soFar   = []
            var module;
            for(var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if(part == "meta") {
                    throw "Module names may not include a part called 'meta'."
                }
                var cur = object[part];
                soFar.push(part)
                var name = soFar.join(".")
                if(typeof cur == "undefined") {
                    object[part]      = {};
                    module            = new Joose.Module(name)
                    module.setContainer(object[part])
                    object[part].meta = module
                    Joose.Module._allModules.push(object[part])
                    
                } else {
                    module = cur.meta;
                    if(!(module && module.meta && (module.meta.isa(Joose.Module)))) {
                        throw "Trying to setup module "+name+" failed. There is already something else: "+module
                    }
                }
                object = object[part]
            }
            var before = joose.currentModule
            joose.currentModule = module
            if(functionThatCreatesClassesAndRoles) {
                functionThatCreatesClassesAndRoles(object);
            }
            joose.currentModule = before;
            return object
        },
        
        getAllModules: function () {
            return this._allModules
        }
    },
    methods: {
        alias: function (destination) {
            var me = this;
            
            if(arguments.length == 0) {
                return this
            }

            Joose.A.each(this.getElements(), function (thing) {
                var global        = me.globalName(thing.meta.className());
                
                if(destination[global] === thing) { // already there
                    return
                }
                
                if(typeof destination[global] != "undefined") {
                    throw "There is already something else in the spot "+global
                }
                
                destination[global] = thing;
            })
        },
        
        globalName: function (name) {
            var moduleName = this.getName();
            if(name.indexOf(moduleName) != 0) {
                throw "All things inside me should have a name that starts with "+moduleName+". Name is "+name
            }
            var rest = name.substr(moduleName.length + 1); // + 1 to remove the trailing dot
            if(rest.indexOf(".") != -1) {
                throw "The things inside me should have no more dots in there name. Name is "+rest
            }
            return rest
        },
        
        removeGlobalSymbols: function () {
            Joose.A.each(this.getElements(), function (thing) {
                var global = this.globalName(thing.getName());
                delete joose.top[global]
            })
        },
        
        initialize: function (name) {
            this.setElements([])
            this.setName(name);
        },
        
        isEmpty: function () {
            return this.getElements().length == 0
        },
        
        addElement: function (ele) {
            if(!(ele || ele.meta)) {
                throw "You may only add things that are Joose objects"
            }
            this._elements.push(ele)
        },
        
        getNames: function () {
            var names = [];
            Joose.A.each(this.getElements(), function (ele) { names.push(ele.meta.getName()) });
            return names
        }
    }
})

__global__ = {};
__global__.meta = new Joose.Module();
__global__.meta.setName("__global__");
__global__.meta.setContainer(__global__);

Joose.Module._allModules = [__global__];

Module("__global__.nomodule", function () {})
__global__.nomodule.meta._elements = joose.globalObjects

// ##########################
// File: Joose/Prototype.js
// ##########################


Class("Joose.Prototype", {
    isa: Joose.Class,
    override: {
        initializer: function () {
            var init = this.SUPER()
            return function () {
                init.apply(this, arguments)
                var meta = this.meta;
                this.meta = new Joose.PrototypeLazyMetaObjectProxy();
                this.meta.metaObject = meta
                this.meta.object     = this;
            }
        }
    }
})


Class("Joose.PrototypeLazyMetaObjectProxy", {
    has: {
        metaObject: {
            is: "rw",
            isa: Joose.Class,
            handles: "*",
            handleWith: function (name) {
                return function () { 
                    // when we are called, turn the objects meta object into the original, detach yourself
                    // and call the original methods
                    var o = this.object;
                    o.meta = this.metaObject;
                    o.detach() 
                    o.meta[name].apply(o.meta, arguments)
                }
            }
        },
        object: {
            is: "rw"
        }
    }
})

Joose.bootstrap3()
// ##########################
// File: Joose/TypeConstraint.js
// ##########################
Class("Joose.TypeConstraint", {
    has: {
        _constraints: {
            is: "ro",
            init: function () { return [] }
        },
        _coercions: {
            is: "ro",
            init: function () { return [] }
        },
        _messages: {
            is: "ro",
            init: function () { return [] }
        },
        _name: {
            is: "ro"
        }
    },
    
    classMethods: {
        newFromTypeBuilder: function (name, props) {
            var t
            if(props.isa) {
                t = props.isa.makeSubType(name);
            } else {
                t = new Joose.TypeConstraint({ name: name });
            }
            
            if(props.where) {
                t.addConstraint(props.where)
            }
            
            if(props.coerce) {
                for(var i = 0; i < props.coerce.length; i++) {
                    var coercionProps = props.coerce[i];
                    t.addCoercion(new Joose.TypeCoercion({
                        from: coercionProps.from,
                        via:  coercionProps.via
                    }))
                }
            }
            
            return t
        }
    },
    
    methods: {
        
        stringify: function () {
            return this._name
        },
        
        makeSubType: function (name) {
            var t = new Joose.TypeConstraint({ name: name })
            Joose.A.each(this._constraints, function (con) {
                t.addConstraint(con)
            })
            return t
        },
        
        addCoercion: function (coercion) {
            this._coercions.push(coercion);
        },
        
        addConstraint: function (func, message) {
            this._constraints.push(func);
            this._messages.push(message)
        },
        
        validateBool: function (value) {
            var i = this._validate(value);
            if(i == -1) {
                return true
            }
            return false
        },
        
        validate: function (value) {
            var i = this._validate(value);
            if(i == -1) {
                return true
            }
            var message = this._messages[i];
            if(message) {
                throw new ReferenceError(message.apply(this, value))
            }
            throw new ReferenceError("The passed value ["+value+"] is not a "+this)
        },
        
        _validate: function (value) {
            var con = this._constraints;
            var i, len;
            for(i = 0, len = con.length; i < len; i++) {
                var func = con[i];
                var result = false;
                if(func instanceof RegExp) {
                    result = func.test(value)
                } else {
                    result = func.call(this, value)
                }
                
                if(!result) {
                    return i
                    
                }
            }
            return -1
        },
        coerce: function (value) {
            if(this.validateBool(value)) {
                return value
            }
            var coercions = this._coercions;
            for(var i = 0, len = coercions.length; i < len; i++) {
                var coercion = coercions[i];
                var result   = coercion.coerce(value);
                if(result != null) {
                    return result
                }
            }
            return null
        }
    }
})
// ##########################
// File: Joose/TypeCoercion.js
// ##########################
Class("Joose.TypeCoercion", {
    has: {
        _from: {
            isa: Joose.TypeConstraint,
            is:  "rw"
        },
        _via: {
            is: "rw"
        }
    },
    
    methods: {
        coerce: function (value) {
            if(this._from.validateBool(value)) {
                return this._via(value)
            }
            return null
        }
    }
})