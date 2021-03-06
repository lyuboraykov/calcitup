﻿(function () {
    "use strict";
    window.box2dWeb = {
        b2Vec2: Box2D.Common.Math.b2Vec2,
        b2BodyDef: Box2D.Dynamics.b2BodyDef,
        b2Body: Box2D.Dynamics.b2Body,
        b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
        b2Fixture: Box2D.Dynamics.b2Fixture,
        b2World: Box2D.Dynamics.b2World,
        b2MassData: Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw: Box2D.Dynamics.b2DebugDraw
    };

    window.createJsB2RectangularBody = function (width, height, positionX, positionY, typeString,
                                    density, restituition, fixedRotationBool, box2dWorld) {
        var SCALE = 30; //box2d works with metres, 1m = 30px;
        this.bodyFixture = new box2dWeb.b2FixtureDef();
        this.bodyFixture.density = density;
        this.bodyFixture.restitution = restituition;
        this.bodyFixture.shape = new box2dWeb.b2PolygonShape();
        this.bodyFixture.shape.SetAsBox((width / 2) / SCALE, (height / 2) / SCALE); //box2dweb measures width from the center of the object
        var b2BodyDef = new box2dWeb.b2BodyDef();
        b2BodyDef.fixedRotation = fixedRotationBool;
        if (typeString == "dynamic") {
            b2BodyDef.type = box2dWeb.b2Body.b2_dynamicBody;
        }
        if (typeString == "static") {
            b2BodyDef.type = box2dWeb.b2Body.b2_staticBody;
        }
        if (typeString == "kinematic") {
            b2BodyDef.type = box2dWeb.b2Body.b2_kinematicBody;
        }
        b2BodyDef.position.x = (positionX + width / 2) / SCALE; //box2dweb sets position of the center of the object
        b2BodyDef.position.y = (positionY + height / 2) / SCALE;
        var b2Body = box2dWorld.CreateBody(b2BodyDef);
        var Dimensions = {
            widthFromCenterMetres: (width / 2) / SCALE,
            heightFromCenterMetres: (height / 2) / SCALE
        }; //used in the actor class
        b2Body.SetUserData(Dimensions);
        b2Body.CreateFixture(this.bodyFixture);
        return b2Body;
    }

    window.actor = function (skin, body) {
        this.skin = skin;
        this.body = body;
    }

    actor.prototype.update = function () {
        this.skin.rotation = this.body.GetAngle() * (180 / Math.PI); //box2d works with radians
        this.skin.x = this.body.GetWorldCenter().x * 30 - this.body.GetUserData().widthFromCenterMetres * 30; //from center to top left
        this.skin.y = this.body.GetWorldCenter().y * 30 - this.body.GetUserData().heightFromCenterMetres * 30;
    }
})();