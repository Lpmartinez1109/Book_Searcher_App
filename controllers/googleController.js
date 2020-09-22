const axios = require("axios");
const db = require("../models");

module.exports = {
    findAll: function(req, res){
        const { query: params} = req;
        axios
          .get("https://www.googleapis.com/books/v1/volumes", {
            params
          })
          .then(results =>
            results.data.items.filter( 
                result=>
                    result.volumeInfo.title &&
                    result.volumeInfo.infoLink &&
                    result.volumeInfo.authors &&
                    result.volumeInfo.description &&
                    result.volumeInfo.imageLinks &&
                    result.volumeInfo.imageLinks.thumbnail
            )
           )
           .then(apiBooks =>
             db.Book.find().then(dbBooks =>
               apiBooks.filter(apiBooks =>
                dbBooks.every(dbBooks => dbBooks.googleId.toString() !== apiBooks.id)
               )
             )
           )
           .then(books => res.json(books))
           .catch(err => res.status(422).json(err));
    }
};