const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token depuis le header
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur (sans le mot de passe)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  } else {
    return res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

module.exports = { protect };
