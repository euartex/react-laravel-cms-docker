<?php

namespace App\Observers;
use App\Company;

class CompanyObserver
{
    /**
     * Handle the company "creating" event.
     *
     * @param \App\Company $company
     * @return void
     */
    public function creating(Company $company)
    {
        if (config('seeding') === false)
            $company->company_id = unique_random(new Company, 'company_id', 15);
    }
}
