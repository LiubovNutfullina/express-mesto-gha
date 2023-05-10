const Card = require('../models/card');
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const getCards = (req, res) => {
    Card.find({})
        .populate(['owner', 'likes'])
        .then((cards) => res.send(cards))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' }));
}; 

const createCard = (req, res) => {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
        .then((card) => res.send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
              res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
            } else {
              res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' });
            }
        });
};

const deleteCard = (req, res) => {
    Card.findByIdAndRemove(req.params.cardId)
        .orFail()
        .then((card) => res.send(card))
        .catch((err) => {
            if (err.name === 'DocumentNotFoundError') {
              res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
              return;
            }
            if (err.name === 'ValidationError') {
              res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
              return;
            }
            res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' });
        });
};

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then((card) => res.send(card))
  .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' });
  });
};

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then((card) => res.send(card))
  .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию' });
  });
}
module.exports = {
    createCard,
    getCards,
    deleteCard,
    likeCard,
    dislikeCard
}
