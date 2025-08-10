<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
    <title>Document</title>
</head>

<body>
    <div class="page-wrapper">
        <div class="main-content">
            <div class="general-content">
                <div class="general-content-top">
                    <?php include 'includes/layouts/header.php'; ?>
                </div>
                <div class="general-content-bottom">
                    <div class="general-content-scrolleable">
                        <?php include 'includes/modules/module-surface.php'; ?>
                        <div class="section-container">
                            <div class="section-content active" data-section="sectionHome">1</div>
                            <div class="section-content disabled" data-section="sectionExplore">2</div>
                            <div class="section-content disabled" data-section="sectionSettings">
                                <div class="section-content active" data-section="sectionProfile">Tu Perfil</div>
                                <div class="section-content disabled" data-section="sectionLogin">Iniciar Sesión</div>
                                <div class="section-content disabled" data-section="sectionAccessibility">Accesibilidad</div>
                                <div class="section-content disabled" data-section="sectionPurchaseHistory">Historial de Compras</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="module" src="assets/js/app-init.js"></script>
</body>

</html>