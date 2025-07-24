import { createI18n } from 'vue-i18n'

const messages = {
  fr: {
    nav: {
      title: "Gestion Foncière",
      register_land: "Enregistrer un terrain",
      transfer_land: "Transférer un terrain",
      rwanda_map: "Carte du Rwanda",
      logout: "Déconnexion"
    },
    home: {
      hero_title: "Système de gestion foncière",
      hero_subtitle: "Favoriser l'avenir foncier du Rwanda",
      hero_desc: "Une plateforme moderne, transparente et efficace pour que les citoyens et les autorités enregistrent, transfèrent et gèrent les terres en toute confiance et simplicité.",
      register_land: "Enregistrer un terrain",
      transfer_land: "Transférer un terrain",
      login_signup: "Connexion / Inscription",
      secure: "Sécurisé & Fiable",
      secure_desc: "Vos dossiers fonciers sont sûrs, accessibles et protégés avec la technologie cloud moderne.",
      fast: "Rapide & Sans Papier",
      fast_desc: "Fini les files d'attente. Enregistrez et transférez des terres en ligne, à tout moment, où que vous soyez.",
      transparent: "Transparent & Responsable",
      transparent_desc: "Suivez vos demandes et transferts. Profitez d'une transparence totale et de la tranquillité d'esprit.",
      copyright: "© 2024 Système de gestion foncière. Tous droits réservés."
    },
    auth: {
      login: "Connexion",
      signup: "Inscription",
      email: "Email",
      password: "Mot de passe",
      confirm_password: "Confirmer le mot de passe",
      logging_in: "Connexion en cours...",
      signing_up: "Inscription en cours...",
      login_success: "Connexion réussie ! Redirection...",
      signup_success: "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.",
      error_required: "L'email et le mot de passe sont obligatoires.",
      error_password_match: "Les mots de passe ne correspondent pas.",
      back_home: "Retour à l'accueil"
    },
    myland: {
      title: "Enregistrement de terrain",
      parcel_id: "ID de la parcelle",
      land_size: "Superficie (m²)",
      location: "Emplacement",
      ownership_type: "Type de propriété",
      documents: "URLs des documents justificatifs",
      add_another: "Ajouter un autre",
      remove: "Supprimer",
      submit: "Soumettre la demande",
      submitting: "Envoi en cours...",
      submitted: "Demande soumise avec succès !",
      failed: "Échec de la soumission. Veuillez réessayer.",
      applications: "Demandes soumises",
      status_pending: "En attente",
      status_completed: "Terminée",
      status_rejected: "Rejetée",
      warning_backend: "Attention : le backend n'est pas connecté. Les données ne sont pas enregistrées sur le serveur."
    },
    transfers: {
      title: "Transfert de terrain",
      select_land: "Sélectionner un terrain",
      parcel_id: "ID de la parcelle",
      transferee_name: "Nom du bénéficiaire",
      transferee_email: "Email du bénéficiaire",
      transfer_type: "Type de transfert",
      reason: "Raison (optionnel)",
      documents: "URLs des documents justificatifs",
      add_another: "Ajouter un autre",
      remove: "Supprimer",
      submit: "Initier le transfert",
      submitting: "Envoi en cours...",
      initiated: "Transfert initié avec succès !",
      failed: "Échec de la soumission. Veuillez réessayer.",
      transfers: "Transferts",
      status_pending: "En attente",
      status_completed: "Terminé",
      status_rejected: "Rejeté",
      update: "Mettre à jour",
      delete: "Supprimer",
      confirm_delete: "Confirmer la suppression",
      are_you_sure: "Êtes-vous sûr de vouloir supprimer ce transfert ?",
      cancel: "Annuler",
      deleted: "Transfert supprimé.",
      warning_backend: "Attention : le backend n'est pas connecté. Les données ne sont pas enregistrées sur le serveur."
    },
    map: {
      click_instruction: "Cliquez sur la carte pour sélectionner un emplacement au Rwanda.",
      clicked_coordinates: "Coordonnées cliquées : {coords}",
      land_points: "Points fonciers de Supabase :",
      latitude: "Lat",
      longitude: "Lon"
    }
  },
  en: {
    nav: {
      title: "Land Management",
      register_land: "Register Land",
      transfer_land: "Transfer Land",
      rwanda_map: "Rwanda Map",
      logout: "Logout"
    },
    home: {
      hero_title: "Land Management System",
      hero_subtitle: "Empowering Rwanda's Land Future",
      hero_desc: "A modern, transparent, and efficient platform for citizens and authorities to register, transfer, and manage land with confidence and ease.",
      register_land: "Register Land",
      transfer_land: "Transfer Land",
      login_signup: "Login / Signup",
      secure: "Secure & Reliable",
      secure_desc: "Your land records are safe, accessible, and protected with modern cloud technology.",
      fast: "Fast & Paperless",
      fast_desc: "No more waiting in lines. Register and transfer land online, anytime, anywhere.",
      transparent: "Transparent & Accountable",
      transparent_desc: "Track your applications and transfers. Enjoy full transparency and peace of mind.",
      copyright: "© 2024 Land Management System. All rights reserved."
    },
    auth: {
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirm_password: "Confirm Password",
      logging_in: "Logging in...",
      signing_up: "Signing up...",
      login_success: "Login successful! Redirecting...",
      signup_success: "Signup successful! Please check your email to confirm your account.",
      error_required: "Email and password are required.",
      error_password_match: "Passwords do not match.",
      back_home: "Back to Home"
    },
    myland: {
      title: "Land Registration",
      parcel_id: "Parcel ID",
      land_size: "Land Size (m²)",
      location: "Location",
      ownership_type: "Ownership Type",
      documents: "Supporting Document URLs",
      add_another: "Add Another",
      remove: "Remove",
      submit: "Submit Application",
      submitting: "Submitting...",
      submitted: "Application submitted successfully!",
      failed: "Submission failed. Please try again.",
      applications: "Submitted Applications",
      status_pending: "Pending",
      status_completed: "Completed",
      status_rejected: "Rejected",
      warning_backend: "Warning: Backend is not connected. Data is not saved to the server."
    },
    transfers: {
      title: "Land Transfer",
      select_land: "Select Land",
      parcel_id: "Parcel ID",
      transferee_name: "Transferee Name",
      transferee_email: "Transferee Email",
      transfer_type: "Transfer Type",
      reason: "Reason (optional)",
      documents: "Supporting Document URLs",
      add_another: "Add Another",
      remove: "Remove",
      submit: "Initiate Transfer",
      submitting: "Submitting...",
      initiated: "Transfer initiated successfully!",
      failed: "Submission failed. Please try again.",
      transfers: "Transfers",
      status_pending: "Pending",
      status_completed: "Completed",
      status_rejected: "Rejected",
      update: "Update",
      delete: "Delete",
      confirm_delete: "Confirm Delete",
      are_you_sure: "Are you sure you want to delete this transfer?",
      cancel: "Cancel",
      deleted: "Transfer deleted.",
      warning_backend: "Warning: Backend is not connected. Data is not saved to the server."
    },
    map: {
      click_instruction: "Click on the map to select a location in Rwanda.",
      clicked_coordinates: "Clicked coordinates: {coords}",
      land_points: "Land Points from Supabase:",
      latitude: "Lat",
      longitude: "Lon"
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'fr', // Default to French
  fallbackLocale: 'en',
  messages
})

export default i18n 