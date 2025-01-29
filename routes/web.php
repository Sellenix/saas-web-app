<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionnaireController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{custom_url}', [QuestionnaireController::class, 'showPublic'])->name('questionnaire.public');

?>

