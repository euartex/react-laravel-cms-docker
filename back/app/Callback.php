<?php

namespace App;

/**
 * Class Callback
 * @package App
 */
class Callback {

    /**
     * @var
     */
    protected $id;

    /**
     * @var
     */
    protected $type;

    /**
     * @var
     */
    protected $action;

    /**
     * @return Int
     */
    public function getId(): Int
    {
        return $this->id;
    }

    /**
     * @return String|null
     */
    public function getType(): ?String
    {
        return $this->type;
    }

    /**
     * @return String|null
     */
    public function getAction(): ?String
    {
        return $this->action;
    }

    /**
     * @param Int $value
     * @return Void
     */
    public function setId(Int $value): Void
    {
        $this->id = $value;
    }

    /**
     * @param String|null $value
     * @return Void
     */
    public function setType(String $value = null): Void
    {
        $this->type = $value;
    }

    /**
     * @param String|null $value
     * @return Void
     */
    public function setAction(String $value = null): Void
    {
        $this->action = $value;
    }
}