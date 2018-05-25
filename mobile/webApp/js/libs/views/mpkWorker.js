/**
 * @author muwj 2016/12/15
 * @editor xiaoj 2017/03/24  remove THREE.Vector dependency for web worker usage
 */
var MPK = MPK || {};

MPK.MPKHeader = function (buffer) {

    var header = new Uint32Array( buffer, 0, 7 );

    this.blockId      = header[0];
    this.startId      = header[1];
    this.vtFormat     = header[2];
    this.meshCount    = header[3];
    this.meshOffset   = header[4];
    this.bufferSize   = header[5];
    this.bufferOffset = header[6];

    header = null;
};

MPK.MeshData = function (buffer, offset) {

    var mesh_info = new Uint32Array(buffer, offset, 4);

    this.mesh_id = mesh_info[0];
    this.ptCount = mesh_info[1];
    this.idxCount = mesh_info[2];
    this.dataOffset = mesh_info[3];

    var base_info = new Float32Array(buffer, offset + 4 * 4, 4);

    this.baseScale = base_info[0];

    this.baseVector = new Float32Array(3);
    this.baseVector[0] =  base_info[1];
    this.baseVector[1] = base_info[2];
    this.baseVector[2] = base_info[3];

    mesh_info = null;
    base_info = null;
};

MPK.MPKReader = function (buffer) {

    this.header = new MPK.MPKHeader(buffer);

    this.meshSize = 4 * 8;
    this.maxSize = 4 * 64;
    this.meshBuffer = buffer.slice(this.header.meshOffset, this.header.meshOffset + this.header.meshCount * this.meshSize);
    this.geomBuffer = buffer.slice(this.header.bufferOffset, this.header.bufferOffset + this.header.bufferSize);

    // for data reading
    this.mesh_cur_id = -1;
    //this.pt_pos = new THREE.Vector3(0.0, 0.0, 0.0);
    this.pt_pos = new Float32Array(3);

    var tmp_buffer = new ArrayBuffer(this.maxSize);
    this.mesh_cur = new MPK.MeshData(tmp_buffer, 0);
    this.mesh_cur.baseVector = this.pt_pos;
};

MPK.MPKReader.prototype = {

    constructor: MPK.MPKReader,

    getMeshData: function (id) {

        var index = id - this.header.startId;
        if (index >= 0 && index < this.header.meshCount) {

            return new MPK.MeshData(this.meshBuffer, index * this.meshSize);
        }
    },

    getMeshInfo: function (id) {

        if (id == this.mesh_cur_id) {
            return this.mesh_cur;
        }

        var index = id - this.header.startId;
        if (index >= 0 && index < this.header.meshCount) {

            var data_i = new Uint32Array(this.meshBuffer, index * this.meshSize, 4);
            this.mesh_cur.mesh_id = data_i[0];
            this.mesh_cur.ptCount = data_i[1];
            this.mesh_cur.idxCount = data_i[2];
            this.mesh_cur.dataOffset = data_i[3];

            var data_f = new Float32Array(this.meshBuffer, index * this.meshSize + 4 * 4, 4);
            this.mesh_cur.baseScale = data_f[0];
            //this.mesh_cur.baseVector.set(data_f[1], data_f[2], data_f[3]);
            this.mesh_cur.baseVector[0] = data_f[1];
            this.mesh_cur.baseVector[1] = data_f[2];
            this.mesh_cur.baseVector[2] = data_f[3];

            this.mesh_cur_id = id;
            return this.mesh_cur;
        }
    },

    getPtBuffer: function (id) {

        var index = id - this.header.startId;
        if (index >= 0 && index < this.header.meshCount) {

            var mesh = this.getMeshInfo(id);
            if (mesh === undefined) {
                return undefined;
            }

            if (mesh.baseScale == 0.0) {
                return new Float32Array(this.geomBuffer, mesh.dataOffset, mesh.ptCount * 3);
            }
            else {
                return new Uint16Array(this.geomBuffer, mesh.dataOffset, mesh.ptCount * 3);
            }
        }
    },

    getIdxBuffer: function (id) {

        var index = id - this.header.startId;
        if (index >= 0 && index < this.header.meshCount) {

            var mesh = this.getMeshInfo(id);
            if (mesh === undefined) {
                return undefined;
            }

            var offset = mesh.dataOffset;
            if (mesh.baseScale == 0.0) {
                offset += mesh.ptCount * 3 * 4;
            }
            else {
                offset += mesh.ptCount * 3 * 2;
                if (mesh.ptCount % 2 == 1) {
                    offset += 2;
                }
            }

            if (mesh.ptCount > 65535) {
                return new Uint32Array(this.geomBuffer, offset, mesh.idxCount);
            }
            else {
                return new Uint16Array(this.geomBuffer, offset, mesh.idxCount);
            }
        }
    },

    getNormalBuffer: function ( id ) {

        var index = id - this.header.startId;
        if ( (this.header.vtFormat & 2) == 2 &&
            index >= 0 &&
            index < this.header.meshCount ) {

            var mesh = this.getMeshInfo( id );
            if ( mesh === undefined ) {
                return undefined;
            }

            var offset = mesh.dataOffset;
            if ( mesh.baseScale == 0.0 ) {
                offset += mesh.ptCount * 3 * 4;
            }
            else {
                offset += mesh.ptCount * 3 * 2;
                if ( mesh.ptCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            if ( mesh.ptCount > 65535 ) {
                offset += mesh.idxCount * 4;
            }
            else {
                offset += mesh.idxCount * 2;
                if ( mesh.idxCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            return new Float32Array( this.geomBuffer, offset, mesh.ptCount * 3 );
        }
    }
};

//importScripts('MPK.js');

self.onmessage = function( event ) {

    var data = event.data.msg;
    //debugger;
    var reader = new MPK.MPKReader(data);
    var id = reader.header.startId;
    var count = id + reader.header.meshCount;
    var result = {};
    for( ; id < count; ++id) {
        var p = reader.getPtBuffer(id);
        var i = reader.getIdxBuffer(id);
        var n = reader.getNormalBuffer(id);
        var m = reader.getMeshData(id);

        if (p == undefined || i == undefined || n == undefined) {
            // empty geometry;
            continue;
        }
        result[id] = {
            P: p,  // position
            I: i,  // index
            N: n,  // normal
            M: m   // mesh info
        };
    }
    reader = null;
    self.postMessage(result);
    self.close();
};