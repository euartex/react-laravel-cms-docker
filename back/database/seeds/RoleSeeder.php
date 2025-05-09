<?php

use App\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {	
    	$rolesArr = ['Admin','Editor'];
       	
       	foreach($rolesArr as $role){
	        $manager = new Role();
	        $manager->name = $role;
	        $manager->slug = Str::slug($role);
	        $manager->save();
	    }
       
    }
}