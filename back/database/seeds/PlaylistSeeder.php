<?php

use JeroenZwart\CsvSeeder\CsvSeeder;
use Illuminate\Support\Facades\DB;
use App\Playlist;
use App\Upload;

class PlaylistSeeder extends CsvSeeder
{

    public function __construct()
    {
        $this->tablename = 'playlists';
        $this->file = base_path(). config('seed.pathCsvs').'/playlists.csv';
        $this->truncate = false;
        $this->header = false;


        $this->mapping = [
            0 => 'playlist_id',
            1 => 'name',
            //2 => 'description',
            7 => 'created_at'
        ];
    }


    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //$playlists = factory(\App\Playlist::class, 30)->create();

        // Recommended when importing larger CSVs
        DB::disableQueryLog();

        parent::run();


        //Additional logic
        $dir = base_path().'/database/seeds/dummy/playlists';

        $files = File::allFiles($dir);

        //Add project id and uploads
        Playlist::All()->each(function ($playlist) use ($files){

            $randomFilePoster = array_random($files);
            $randomFileCover = array_random($files);
            $playlist->project_id = 1;

            $playlist->poster_id = factory(Upload::class)->make(['hash' => $playlist->playlist_id, 'instance' => 'playlist', 'url'=> $randomFilePoster])->id;
            $playlist->cover_id = factory(Upload::class)->make(['hash' => $playlist->playlist_id, 'instance' => 'playlist', 'url'=> $randomFileCover])->id;

            $playlist->save();
        });


        //Set random to top
        $top = Playlist::all()->random(1)->first();
        $top->is_top = true;
        $top->save();
        //End Additional logic
    }
}
