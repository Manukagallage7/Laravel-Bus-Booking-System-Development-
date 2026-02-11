<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'manukakavinda1110@gmail.com'],
            [
                'name' => 'Manuka Gallage',
                'password' => Hash::make('Manuka@1110'),
                'role' => 'admin',
            ]
        );
    }
}
