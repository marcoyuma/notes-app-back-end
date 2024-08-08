const Hapi = require('@hapi/hapi');
// 'nanoid' versi terbaru adalah es dan harus pakai 'import()'
const { nanoid } = require('nanoid');
const notes = require('./notes');
/**
 * @param { Hapi.Request } request
 * @param { Hapi.Request } request
 * @param { Hapi.ResponseToolkit } h
 * @param { Hapi.ResponseToolkit } h
 */

// fungsi untuk handler 'POST' 
const addNoteHandler = (request, h)=>{
    // logika untuk menyimpan catatan dari client ke dalam array notes.Client mengirim data catatan (title, tags, dan body) yang akan disimpan dalam bentuk JSON melalui body request
    const { title, tags, body } = request.payload;

    // parameter angka adalah ukuran dari stringnya
    const id = nanoid(16)  
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status : 'success',
            message : 'catatan ini berhasil ditambahkan',
            data : {
                noteId : id,
            },
        });

        response.code(201)
        return response;
    }

    const response = h.response({
        status : 'fail',
        message : 'catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// fungsi untuk handler 'GET' menampilkan notes
const getAllNotesHandler = () => ({
    status : 'success',
    data : {
        notes,
    }
});

/** jsdoc untuk parameter 'getNoteByIdHandler'
 * @param { Hapi.Request } request
 * @param { Hapi.ResponseToolkit } h
 */

// fungsi untuk handler 'GET' notes id utk menampilkan notes spesifik
const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    // jika berhasil akan return success dan program berhasil
    if (note !== undefined){
        return {
            status : 'success',
            data : {
                note,
            }
        }
    }

    // jika gagal kode di atas tidak return nilainya dan kode ini dijalankan terus ke bawah
    const response = h.response({
        status : 'fail',
        message : 'catatan tidak ditemukan'
    });
    response.code(404);
    return response;
};

// jsdoc mandiri untuk parameter di bawah
/**
 * @param {Hapi.Request} request
 * @param {Hapi.ResponseToolkit} h
 */

// handler dengan method 'PUT' untuk mengubah catatan
const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status : 'success',
            message : 'catatan berhasil diubah'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status : 'fail',
        message : 'gagal memperbarui catatan. id tidak ditemukan'
    });
    response.code(404);
    return response;   
}


/**
 * @param {Hapi.Request} request
 * @param {Hapi.ResponseToolkit} h
 */
// fungsi untuk delete notes
const deleteNoteByIdHandler = (request, h) => {
    // dapatkan nilai id
    const {id} = request.params;

    // dapatkan index
    const index = notes.findIndex((note) => note.id === id)

    // utk mengapus nilai array mengguanakn index. gunakan method array splice
    if (index !== -1){
        notes.splice(index, 1);

        const response = h.response({
            status : 'success',
            message : 'catatan berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    // bila index bernilai -1, return fail
    const response = h.response({
        status : 'fail',
        message : 'catatan gagal dihapus'
    });
    response.code(404);
    return response
}



module.exports = {
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler 
    };