<?php

namespace App\Observers;

use App\Tag;
use App\Enums\StatusCode;

class TagObserver
{
    /**
     * Handle the tag "created" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function created(Tag $tag)
    {
        //
    }

    /**
     * Handle the tag "updated" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function updated(Tag $tag)
    {
        /**
        * Marking old "is_top_news tag" = false
        */
        if($tag->is_top_news_tag) Tag::whereIsTopNewsTag(true)->where('id', '!=', $tag->id)->update(['is_top_news_tag' => false]);
    }

    /**
     * Handle the tag "updating" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function updating(Tag $tag)
    {  
        /**
        * Blocking unmarking "Top news" tag
        */
        if(!$tag->is_top_news_tag AND !Tag::whereIsTopNewsTag(true)->where('id', '!=', $tag->id)->exists()){

            $tag->error = 'This tag is marked like "Top news tag". Unmarking is possible by marking another tag only!'; 
            return false;
        }
    }

    /**
     * Handle the tag "deleting" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function deleting(Tag $tag)
    {  
        /**
        * Deleting not allowed in this case
        */
        if($tag->is_top_news_tag){

            $tag->error = 'This tag is marked like "Top news tag". Deleting for "Top news tags" is not allowed!'; 
            return false;
        }
    }

    /**
     * Handle the tag "deleted" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function deleted(Tag $tag)
    {
        //
    }

    /**
     * Handle the tag "restored" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function restored(Tag $tag)
    {
        //
    }

    /**
     * Handle the tag "force deleted" event.
     *
     * @param  \App\Tag  $tag
     * @return void
     */
    public function forceDeleted(Tag $tag)
    {
        //
    }
}
