<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('auth/user', function(){
    if(auth()->check()){
        return response()->json([
            'authUser' =>auth()->user()
        ]);
        return null;
    }
});

Route::get('chat/with/{user}','App\Http\Controllers\ChatController@chat_with')->name('chat.with');

Route::get('chat/{chat}','App\Http\Controllers\ChatController@show')->name('chat.show');

Route::post('message/sent','App\Http\Controllers\MessageController@sent')->name('message.sent');

Route::get('chat/{chat}/get_messages', 'App\Http\Controllers\ChatController@get_messages')->name('chat.get_messages');