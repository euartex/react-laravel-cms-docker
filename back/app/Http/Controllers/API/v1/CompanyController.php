<?php

namespace App\Http\Controllers\API\v1;

use App\Company;
use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyRequest;
use Config as Cnf;
use Illuminate\Database\Eloquent\Builder;

use Image;


class CompanyController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/companies/accessible-list",
     *       tags={"Companies"},
     *       summary="Accessible list of all companies",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of companies pages has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Limit items per page",
     *         in="query",
     *         name="limit",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="20"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Page number",
     *         in="query",
     *         name="page",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="0"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Search text",
     *         in="query",
     *         name="q",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *)
     */
    public function list(CompanyRequest $request)
    {
        return $this->getCompanies($request);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/companies",
     *       tags={"Companies"},
     *       summary="Get list of all companies",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of companies pages has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Limit items per page",
     *         in="query",
     *         name="limit",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="20"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Page number",
     *         in="query",
     *         name="page",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="0"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Search text",
     *         in="query",
     *         name="q",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Has top playlist",
     *         in="query",
     *         name="has_toplist",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *      ),
     *)
     */
    public function index(CompanyRequest $request)
    {
        return $this->getCompanies($request);
    }


    public function getCompanies(CompanyRequest $request)
    {

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $companies = Company::query()->listSelect();

        if($request->filled('has_toplist') and filter_var(request('has_toplist'), FILTER_VALIDATE_BOOLEAN)) $companies->getTopPlaylistCompany();

        if ($request->filled('q')) $companies = $companies->search(request('q'),null, true, true);

        if ($companies = $companies->orderBy('name')->paginate($limit)) {
            $companies = $companies->toArray();

            return response()->json([
                'data' => $companies['data'],
                'pagination' => HelperController::getPagination($companies)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/companies/{id}",
     *       tags={"Companies"},
     *       summary="Get one company",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about company"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Company id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *      ),
     *)
     */
    public function show(CompanyRequest $request,  $id)
    {
        if ($company = Company::findOrFail($id)) return response()->json(['data' => $company], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/companies",
     *       tags={"Companies"},
     *       summary="Create new company",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Company has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name","email"},
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="address", type="string"),
     *                  @OA\Property(property="country", type="string"),
     *                  @OA\Property(property="phone", type="string"),
     *                  @OA\Property(property="email", type="string"),
     *                  @OA\Property(property="zip", type="string"),
     *                  @OA\Property(property="auto_published", type="boolean"),
     *                  @OA\Property(property="is_auto_assign_top_news_tag", type="boolean"),     
     *                  @OA\Property(
     *                      property="tag_ids",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(CompanyRequest $request)
    {
        if($company = Company::create($request->all())){

            //Sync tags
            if ($request->filled('tag_ids')) $company->meta_tags()->sync($request->get('tag_ids'));

            if ($company->save()) return response()->json(['data' => $company], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/companies/{id}",
     *       tags={"Companies"},
     *       summary="Update company",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'. More about <a href='https://github.com/laravel/framework/issues/13457#issuecomment-239451567'>issue</a>",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Company has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Company id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *      ),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="address", type="string"),
     *                  @OA\Property(property="country", type="string"),
     *                  @OA\Property(property="phone", type="string"),
     *                  @OA\Property(property="email", type="string"),
     *                  @OA\Property(property="zip", type="string"),   
     *                  @OA\Property(property="auto_published", type="boolean"),
     *                  @OA\Property(property="is_auto_assign_top_news_tag", type="boolean"),     
     *                  @OA\Property(
     *                      property="tag_ids",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(CompanyRequest $request, $id)
    {
        if ($company = Company::findOrFail($id)) {

            $company->fill($request->all());

            //Sync tags
            if ($request->filled('tag_ids'))
                $company->meta_tags()->sync($request->get('tag_ids'));

            if ($company->save()) {
                $company->refresh();
                return response()->json(['data' => $company], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/scompanies/{id}",
     *       tags={"Companies"},
     *       summary="Delete company",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Company has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Company id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *      ),
     *)
     */
    public function destroy($id)
    {
        if ($company = Company::findOrFail($id)) {
            if ($company->delete()) return response()->json(['message' => 'Company has been deleted'], StatusCode::SUCCESS);
        }
    }
}
