import BaseSerializer from './BaseSerializer';
import Serializers from './Serializers';

import ConfigSerializer from './serializer/ConfigSerializer';
import ScriptSerializer from './serializer/ScriptSerializer';

import Object3DSerializer from './serializer/Object3DSerializer';

import SceneSerializer from './serializer/SceneSerializer';

import CameraSerializer from './serializer/CameraSerializer';
import OrthographicCameraSerializer from './serializer/OrthographicCameraSerializer';
import PerspectiveCameraSerializer from './serializer/PerspectiveCameraSerializer';

import LightSerializer from './serializer/LightSerializer';
import PointLightSerializer from './serializer/PointLightSerializer';
import SpotLightSerializer from './serializer/SpotLightSerializer';
import HemisphereLightSerializer from './serializer/HemisphereLightSerializer';
import RectAreaLightSerializer from './serializer/RectAreaLightSerializer';

import GeometrySerializer from './serializer/GeometrySerializer';

import MaterialSerializer from './serializer/MaterialSerializer';

import MeshSerializer from './serializer/MeshSerializer';

/**
 * 场景序列化/反序列化类
 */
function Converter() {
    BaseSerializer.call(this);

    this.serializers = [
        new ConfigSerializer(),
        new ScriptSerializer(),
        new Object3DSerializer(),
        new SceneSerializer(),

        new CameraSerializer(),
        new OrthographicCameraSerializer(),
        new PerspectiveCameraSerializer(),

        new LightSerializer(),
        new PointLightSerializer(),
        new SpotLightSerializer(),
        new HemisphereLightSerializer(),
        new RectAreaLightSerializer(),
        new GeometrySerializer(),

        new MaterialSerializer(),

        new MeshSerializer()
    ];
}

Converter.prototype = Object.create(BaseSerializer.prototype);
Converter.prototype.constructor = Converter;

Converter.prototype.filter = function (obj) {
    return true;
};

Converter.prototype.toJSON = function (app) {
    var list = [];

    // 配置
    var config = {
        Metadata: Serializers.Config.Metadata,
        Object: Serializers.Config.Serializer.toJSON(app.editor.config),
    };
    list.push(config);

    // 相机
    var camera = {
        Metadata: Serializers.PerspectiveCamera.Metadata,
        Object: Serializers.PerspectiveCamera.Serializer.toJSON(app.editor.camera)
    };
    list.push(camera);

    // 脚本
    Object.keys(app.editor.scripts).forEach(function (id) {
        var name = app.editor.scripts[id].name;
        var source = app.editor.scripts[id].source;
        var script = {
            Metadata: Serializers['Script'].Metadata,
            Object: Serializers['Script'].Serializer.toJSON({
                id: id,
                name: name,
                source: source
            })
        };
        list.push(script);
    });

    // 场景
    app.editor.scene.traverse(function (obj) {
        if (Serializers[obj.constructor.name] != null) {
            var json = {
                Metadata: Serializers[obj.constructor.name].Metadata,
                Object: Serializers[obj.constructor.name].Serializer.toJSON(obj)
            };
            list.push(json);
        } else {
            console.log(`There is no serializer to serialize ${obj.name}`);
        }
    });

    return list;
};

Converter.prototype.fromJson = function (json) {

};

export default Converter;